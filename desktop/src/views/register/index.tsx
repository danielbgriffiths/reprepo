/**
 * Registration view component
 */
export default function Register() {
  const { validate, formSubmit, errors } = useForm({
    errorClass: "error-input",
  });
  const fn = (form) => {
    // form.submit()
    console.log("Done");
  };
  const userNameExists = async ({ value }) => {
    const exists = await fetchUserName(value);
    return exists && `${value} is already being used`;
  };

  const matchesPassword = ({ value }) =>
    value === fields.password ? false : "Passwords must Match";

  return (
    <div class="rr-splash-view">
      <div class="rr-splash-view-content">
        <h3>Welcome to Reprepo</h3>
        <form use:formSubmit={fn}>
          <div class="field-block">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              use:validate={[userNameExists]}
            />
            {errors.email && <ErrorMessage error={errors.email} />}
          </div>
          <div class="field-block">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required=""
              minLength="8"
              onInput={(e) => setFields("password", e.target.value)}
              use:validate
            />
            {errors.password && <ErrorMessage error={errors.password} />}
          </div>
          <div class="field-block">
            <input
              type="password"
              name="confirmpassword"
              placeholder="Confirm Password"
              required=""
              use:validate={[matchesPassword]}
            />
            {errors.confirmpassword && (
              <ErrorMessage error={errors.confirmpassword} />
            )}
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
