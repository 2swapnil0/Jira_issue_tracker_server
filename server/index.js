import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const { JIRA_BASE_URL, JIRA_API_TOKEN, JIRA_PROJECT_KEY } = process.env;

if (!JIRA_BASE_URL || !JIRA_API_TOKEN || !JIRA_PROJECT_KEY) {
  console.error('Missing required environment variables');
  process.exit(1); // Exit if env variables are missing
}

const headers = {
  'Authorization': `Basic ${Buffer.from(`swapnilmhatre671@gmail.com:${JIRA_API_TOKEN}`).toString('base64')}`,
  'Accept': 'application/json'
};

app.use(cors());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/issues', async (req, res) => {
  try {
    const response = await axios.get(`${JIRA_BASE_URL}/rest/api/3/search?jql=project=${JIRA_PROJECT_KEY}`, { headers });
    const issues = response.data.issues.map(issue => ({
      key: issue.key,
      summary: issue.fields.summary,
      issueType: issue.fields.issuetype.name,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee ? issue.fields.assignee.displayName : 'Unassigned'
    }));
    res.json(issues);
  } catch (error) {
    console.error('Error fetching issues:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
