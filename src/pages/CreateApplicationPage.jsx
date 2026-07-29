function CreateApplicationPage() {
  function handleSubmit(event) {
    event.preventDefault();

    console.log("Create form submitted");
  }

  return (
    <section>
      <h1>Add Application</h1>

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
          Create Application
        </button>
      </form>
    </section>
  );
}

export default CreateApplicationPage;