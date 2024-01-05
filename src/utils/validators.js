export const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
      );
  };