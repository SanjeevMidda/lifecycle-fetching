const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    const delay = Math.floor(Math.random() * 1000) + 1000;

    setTimeout(() => {
      const shouldFail = Math.random() < 0.3;

      if (shouldFail) {
        reject(new Error("Failed to delete user. Please try again."));
      } else {
        resolve({ id });
      }
    }, delay);
  });
};

export default deleteUser;
