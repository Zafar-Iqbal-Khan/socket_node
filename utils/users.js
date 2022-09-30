const users = [];

// Join user to chat
function userJoin(id, username, room1,room2) {
  const user = { id, username, room1,room2 };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
// function getRoomUsers(room1) { 
//   return users.filter(user => user.room1 === room1);
// }
function getRoomUsers(room1,room2) { 
  return users.filter(user =>{
    return (user.room1 === room1 &&   user.room2===room2) || (user.room1 === room2 &&   user.room2===room1);
  });
}


module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
