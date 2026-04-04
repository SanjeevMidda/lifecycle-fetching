import USERS from "../data/users";

const fetchUsers = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const usersExist = Math.random() > 0.1;

      if (usersExist) {
        resolve(USERS);
      } else {
        reject(new Error(`Failed to fetch users`));
      }
    }, 2000);
  });
};

export default fetchUsers;
