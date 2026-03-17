const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@test.com",
    password: "password",
    role: "admin",
  },
  {
    id: 2,
    name: "Editor User",
    email: "editor@test.com",
    password: "password",
    role: "editor",
  },
  {
    id: 3,
    name: "Viewer User",
    email: "viewer@test.com",
    password: "password",
    role: "viewer",
  },
];

const articles = [
  {
    id: 1,
    title: "Welcome Article",
    content: "This article is visible to all authenticated roles.",
    createdBy: "Admin User",
  },
];

let nextArticleId = 2;

function createArticle({ title, content, createdBy }) {
  const article = {
    id: nextArticleId,
    title,
    content,
    createdBy,
  };

  articles.push(article);
  nextArticleId += 1;
  return article;
}

function deleteArticleById(id) {
  const index = articles.findIndex((article) => article.id === id);

  if (index === -1) {
    return false;
  }

  articles.splice(index, 1);
  return true;
}

module.exports = {
  users,
  articles,
  createArticle,
  deleteArticleById,
};
