const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

// 使用 CORS 中间件
app.use(cors());
app.use(express.json())

// 定义getRecordDetail接口
app.get('/getRecordDetail', async (req, res) => {
  const { code } = req.query; // 从查询参数中获取code值

  if (!code) {
    return res.status(400).send('Code is required');
  }

  const url = `https://fundf10.eastmoney.com/F10DataApi.aspx?type=lsjz&code=${code}`;

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const data = [];

    // 根据实际HTML结构修改选择器
    $('table tr').each((index, element) => {
      const row = $(element).find('td').map((i, el) => $(el).text()).get();
      if (row.length > 0) {
        data.push(row);
      }
    });

    // 将解析后的数据返回给客户端
    res.json(data);
  } catch (error) {
    console.error('Error fetching and parsing data', error);
    res.status(500).send('Internal Server Error');
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
