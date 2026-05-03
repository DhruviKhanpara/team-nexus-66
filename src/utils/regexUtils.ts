const orgSlugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const isEmailValid = (value: string) => {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value);
};

const isUsernameValid = (value: string) => {
  return /^[a-z0-9_]+$/.test(value);
};

const isPasswordValid = (value: string) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    value,
  );
};

export { orgSlugRegex, isEmailValid, isUsernameValid, isPasswordValid };
