import { User } from "./User.ts"
import { Post } from "./Post.ts"

User.hasMany(Post, {
  foreignKey: "userId",
  as: "posts",
});

Post.belongsTo(User, {
  foreignKey: "userId",
  as: "author",
})

export { User, Post };