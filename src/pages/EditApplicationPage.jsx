import { useParams } from "react-router-dom";

function EditApplicationPage() {
  const { id } = useParams();

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Edit form submitted");
  }

  return (
    <section>
      <h1>Edit Application</h1>

      <p>Editing application ID: {id}</p>

      <form onSubmit={handleSubmit}>
        <label>
          Company
          <input type="text" name="company" />
        </label>

        <label>
          Position
          <input type="text" name="position" />
        </label>

        <button type="submit">
          Save Changes
        </button>
      </form>
    </section>
  );
}

export default EditApplicationPage;