import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 8080;

app.get('/users', async (req, res) => {
  let { page = 1, limit = 5 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  try {
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/users'
    );
    const users = response.data;

    // Pagination implementation
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const totalPages = Math.ceil(users.length / limit);

    // Return empty data if out of range
    if (startIndex >= users.length) {
      return res.json({
        page,
        limit,
        total: users.length,
        data: [],
      });
    }

    const paginatedUsers = users.slice(startIndex, endIndex);

    // previous and next page links
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    res.json({
      page,
      limit,
      total: users.length,
      totalPages,
      data: paginatedUsers,
      nextPage: nextPage
        ? `http://localhost:${PORT}/users?page=${nextPage}&limit=${limit}`
        : null,
      prevPage: prevPage
        ? `http://localhost:${PORT}/users?page=${prevPage}&limit=${limit}`
        : null,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching data',
      error: error.message,
    });
  }
});

app.listen(PORT, (req, res) => {
  console.log(`Server started on PORT ${PORT}.`);
});
