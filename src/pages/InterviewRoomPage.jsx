// src/pages/InterviewRoomPage.jsx
// Mock interview rooms with live voice.
//
// Two people practise interviewing each other. You share a room code, both
// join it, and your browsers send audio straight to each other.
//
// The server only passes setup messages between you (the "signaling"
// step). Once the call is connected the audio does not go through the
// server at all.
//
// The function names below match the WebRTC documentation:
//   getAudioStream            - ask for the microphone
//   createPeerConnection      - build one connection to one other person
//   handleNegotiationNeededEvent - the caller sends an offer
//   handleICECandidateEvent   - share a possible network route
//   handleOnTrackEvent        - play the audio that arrives

import { useCallback, useEffect, useRef, useState } from "react";

import { socket } from "../socket.js";

import "./InterviewRoomPage.css";

// Must match ROOM_ID_PATTERN on the server.
const ROOM_ID_PATTERN = /^[A-Za-z0-9-]{4,32}$/;

// A STUN server helps a browser discover how it looks from the outside.
// It is enough for two people on the same network or behind ordinary home
// routers. Strict company networks also need a TURN relay, which is the
// next step after this one.
const ICE_SERVERS = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function generateRoomCode() {
  // Avoids look-alike characters (0/O, 1/I) because the code gets read out
  // loud or typed by hand.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let index = 0; index < 6; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return code;
}

function InterviewRoomPage() {
  const [roomCode, setRoomCode] = useState(generateRoomCode);
  const [joinedRoom, setJoinedRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // ---------- refs ----------
  //
  // These are refs rather than state because changing them must not
  // re-render the page, and because the socket handlers below need to read
  // the current value rather than the value from the render they were
  // created in.

  // Our own microphone audio.
  const localStreamRef = useRef(null);

  // One RTCPeerConnection per other person, keyed by their socket id.
  const peersConnectionRef = useRef({});

  // One <audio> element per other person, so we can hear them.
  const remoteAudioRef = useRef({});

  // ICE candidates that arrived before we were ready for them. See the
  // comment in the new-ice-candidate handler.
  const pendingCandidatesRef = useRef({});

  // Where the audio elements get attached in the DOM.
  const audioContainerRef = useRef(null);

  const joinedRoomRef = useRef(null);

  useEffect(() => {
    joinedRoomRef.current = joinedRoom;
  }, [joinedRoom]);

  // ---------- microphone ----------

  // Ask the browser for the microphone. This is what triggers the
  // permission prompt. Audio only — this is a voice call, not video.
  const getAudioStream = useCallback(async () => {
    if (localStreamRef.current) {
      return localStreamRef.current;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    localStreamRef.current = stream;

    return stream;
  }, []);

  // ---------- tearing down ----------

  // Close one person's connection and stop playing their audio.
  const closePeer = useCallback((remoteSocketId) => {
    const peer = peersConnectionRef.current[remoteSocketId];

    if (peer) {
      peer.close();
      delete peersConnectionRef.current[remoteSocketId];
    }

    const audioElement = remoteAudioRef.current[remoteSocketId];

    if (audioElement) {
      audioElement.srcObject = null;
      audioElement.remove();
      delete remoteAudioRef.current[remoteSocketId];
    }

    delete pendingCandidatesRef.current[remoteSocketId];
  }, []);

  // Close everything: every connection, and our own microphone.
  // Releasing the microphone is what turns off the browser's recording
  // indicator, so it matters that this runs.
  const closeAllPeers = useCallback(() => {
    for (const remoteSocketId of Object.keys(peersConnectionRef.current)) {
      closePeer(remoteSocketId);
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    setIsMuted(false);
  }, [closePeer]);

  // ---------- socket + WebRTC wiring ----------

  useEffect(() => {
    // Send one possible network route to the other person as soon as it is
    // found, instead of waiting for the full list ("trickle ICE").
    function handleICECandidateEvent(event, remoteSocketId) {
      if (!event.candidate) {
        return;
      }

      socket.emit("new-ice-candidate", {
        candidate: event.candidate,
        to: remoteSocketId,
      });
    }

    // Their audio arrived. Create an <audio> element and play it.
    function handleOnTrackEvent(event, remoteSocketId) {
      const [remoteStream] = event.streams;

      let audioElement = remoteAudioRef.current[remoteSocketId];

      if (!audioElement) {
        audioElement = document.createElement("audio");
        audioElement.autoplay = true;
        remoteAudioRef.current[remoteSocketId] = audioElement;
        audioContainerRef.current?.appendChild(audioElement);
      }

      audioElement.srcObject = remoteStream;
    }

    // Only the person who was already in the room starts the negotiation.
    // If both sides sent an offer at once they would talk over each other.
    async function handleNegotiationNeededEvent(peer, remoteSocketId) {
      try {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        socket.emit("voice-offer", { offer, to: remoteSocketId });
      } catch (error) {
        console.error("Could not create offer:", error);
      }
    }

    // Build one connection to one other person.
    function createPeerConnection(remoteSocketId, isInitiator) {
      const peer = new RTCPeerConnection(ICE_SERVERS);

      // Put our microphone onto the connection so they can hear us.
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          peer.addTrack(track, localStreamRef.current);
        });
      }

      peer.onicecandidate = (event) =>
        handleICECandidateEvent(event, remoteSocketId);

      peer.ontrack = (event) => handleOnTrackEvent(event, remoteSocketId);

      if (isInitiator) {
        peer.onnegotiationneeded = () =>
          handleNegotiationNeededEvent(peer, remoteSocketId);
      }

      peersConnectionRef.current[remoteSocketId] = peer;

      return peer;
    }

    // Candidates that arrived too early get replayed here.
    async function drainPendingCandidates(peer, remoteSocketId) {
      const waiting = pendingCandidatesRef.current[remoteSocketId] || [];

      for (const candidate of waiting) {
        try {
          await peer.addIceCandidate(candidate);
        } catch (error) {
          console.error("Could not add buffered candidate:", error);
        }
      }

      delete pendingCandidatesRef.current[remoteSocketId];
    }

    // ----- socket handlers -----

    function handleConnect() {
      setIsConnecting(false);
    }

    function handleConnectError(error) {
      setIsConnecting(false);
      setErrorMessage(
        error.message === "Authentication required"
          ? "Please log in again to use interview rooms."
          : `Could not connect: ${error.message}`,
      );
    }

    function handleRoomUsers({ users }) {
      setParticipants(users);
    }

    // Someone new arrived. We were here first, so we make the call.
    function handleUserJoined({ socketId, username }) {
      setParticipants((current) => [...current, { socketId, username }]);
      createPeerConnection(socketId, true);
    }

    // We are being called. Answer it.
    async function handleOffer({ offer, from }) {
      try {
        const peer =
          peersConnectionRef.current[from] ||
          createPeerConnection(from, false);

        await peer.setRemoteDescription(offer);
        await drainPendingCandidates(peer, from);

        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        socket.emit("voice-answer", { answer, to: from });
      } catch (error) {
        console.error("Could not answer call:", error);
        setErrorMessage("Could not connect the call.");
      }
    }

    // They answered our call.
    async function handleAnswer({ answer, from }) {
      const peer = peersConnectionRef.current[from];

      if (!peer) {
        return;
      }

      try {
        await peer.setRemoteDescription(answer);
        await drainPendingCandidates(peer, from);
      } catch (error) {
        console.error("Could not apply answer:", error);
      }
    }

    // A candidate can arrive before setRemoteDescription has run, and
    // adding one before that point throws. Anything early gets held here
    // and replayed once the description is in place.
    async function handleNewIceCandidate({ candidate, from }) {
      const peer = peersConnectionRef.current[from];

      if (!peer || !peer.remoteDescription) {
        pendingCandidatesRef.current[from] =
          pendingCandidatesRef.current[from] || [];
        pendingCandidatesRef.current[from].push(candidate);
        return;
      }

      try {
        await peer.addIceCandidate(candidate);
      } catch (error) {
        console.error("Could not add candidate:", error);
      }
    }

    function handleUserLeft({ socketId }) {
      setParticipants((current) =>
        current.filter((person) => person.socketId !== socketId),
      );
      closePeer(socketId);
    }

    function handleVoiceError({ message }) {
      setErrorMessage(message);
      setJoinedRoom(null);
      setParticipants([]);
      closeAllPeers();
    }

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("voice-room-users", handleRoomUsers);
    socket.on("voice-user-joined", handleUserJoined);
    socket.on("voice-user-left", handleUserLeft);
    socket.on("voice-offer", handleOffer);
    socket.on("voice-answer", handleAnswer);
    socket.on("new-ice-candidate", handleNewIceCandidate);
    socket.on("voice-error", handleVoiceError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("voice-room-users", handleRoomUsers);
      socket.off("voice-user-joined", handleUserJoined);
      socket.off("voice-user-left", handleUserLeft);
      socket.off("voice-offer", handleOffer);
      socket.off("voice-answer", handleAnswer);
      socket.off("new-ice-candidate", handleNewIceCandidate);
      socket.off("voice-error", handleVoiceError);
    };
  }, [closePeer, closeAllPeers]);

  // Leave cleanly if the user navigates away while still in a room.
  useEffect(() => {
    return () => {
      if (joinedRoomRef.current) {
        socket.emit("voice-leave");
      }

      closeAllPeers();
      socket.disconnect();
    };
  }, [closeAllPeers]);

  // ---------- actions ----------

  async function handleJoin(event) {
    event.preventDefault();

    const code = roomCode.trim();

    if (!ROOM_ID_PATTERN.test(code)) {
      setErrorMessage("Room codes use 4-32 letters, numbers or dashes.");
      return;
    }

    setErrorMessage("");
    setIsConnecting(true);

    try {
      // Get the microphone before joining. If we joined first, someone
      // could call us before we had any audio to send them.
      await getAudioStream();
    } catch {
      setIsConnecting(false);
      setErrorMessage(
        "Microphone access was blocked. Allow it in your browser, then try again.",
      );
      return;
    }

    socket.connect();
    socket.emit("voice-join", { roomId: code });

    setJoinedRoom(code);
  }

  function handleLeave() {
    socket.emit("voice-leave");
    closeAllPeers();
    setJoinedRoom(null);
    setParticipants([]);
    setErrorMessage("");
  }

  // Muting turns the track off rather than removing it, so the connection
  // stays up and the other person simply hears silence.
  function handleToggleMute() {
    const stream = localStreamRef.current;

    if (!stream) {
      return;
    }

    const nextMuted = !isMuted;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !nextMuted;
    });

    setIsMuted(nextMuted);
  }

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(joinedRoom);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrorMessage("Could not copy. You can read the code above.");
    }
  }

  // ---------- before joining ----------

  if (!joinedRoom) {
    return (
      <section className="page-container">
        <h1>Mock Interview Room</h1>

        <p className="page-description">
          Practise interviewing with someone else. Share a room code, both
          join it, and you can talk directly.
        </p>

        <form className="room-form" onSubmit={handleJoin}>
          <label htmlFor="room-code">Room code</label>

          <div className="room-form-row">
            <input
              id="room-code"
              type="text"
              value={roomCode}
              onChange={(event) => {
                setRoomCode(event.target.value);

                // Clear the previous complaint as soon as the user starts
                // fixing it. Otherwise an error from a half-typed code
                // stays on screen next to a code that is now valid.
                setErrorMessage("");
              }}
              placeholder="e.g. PRACTICE-1"
              autoComplete="off"
            />

            <button
              type="button"
              className="secondary-button"
              onClick={() => setRoomCode(generateRoomCode())}
            >
              New code
            </button>

            <button type="submit" disabled={isConnecting}>
              {isConnecting ? "Joining..." : "Join room"}
            </button>
          </div>
        </form>

        {errorMessage && (
          <p className="status-message status-message-error">
            {errorMessage}
          </p>
        )}

        <p className="room-hint">
          Your browser will ask for microphone permission when you join.
          Anyone with the code can join, so share it only with the person
          you are practising with. Up to 4 people per room.
        </p>
      </section>
    );
  }

  // ---------- inside a room ----------

  return (
    <section className="page-container">
      <h1>Mock Interview Room</h1>

      {/* The remote audio elements are attached here. They have no
          controls, so there is nothing to see — only to hear. */}
      <div ref={audioContainerRef} className="remote-audio-container" />

      <div className="room-panel">
        <div className="room-panel-header">
          <div>
            <p className="room-code-label">Room code</p>
            <p className="room-code-value">{joinedRoom}</p>
          </div>

          <div className="room-panel-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={handleCopyCode}
            >
              {copied ? "Copied" : "Copy code"}
            </button>

            <button
              type="button"
              className={isMuted ? "muted-button" : "secondary-button"}
              onClick={handleToggleMute}
              aria-pressed={isMuted}
            >
              {isMuted ? "Unmute" : "Mute"}
            </button>

            <button
              type="button"
              className="leave-button"
              onClick={handleLeave}
            >
              Leave room
            </button>
          </div>
        </div>

        <h2 className="participants-title">
          In this room ({participants.length + 1})
        </h2>

        <ul className="participant-list">
          <li className="participant participant-self">
            You
            <span className="participant-tag">
              {isMuted ? "muted" : "mic on"}
            </span>
          </li>

          {participants.map((person) => (
            <li key={person.socketId} className="participant">
              {person.username}
            </li>
          ))}
        </ul>

        {participants.length === 0 && (
          <p className="state">
            Waiting for someone else to join. Share the code above.
          </p>
        )}
      </div>

      {errorMessage && (
        <p className="status-message status-message-error">
          {errorMessage}
        </p>
      )}

      <p className="room-hint">
        Audio goes directly between browsers. On a restrictive network a
        call may not connect without a relay server.
      </p>
    </section>
  );
}

export default InterviewRoomPage;
