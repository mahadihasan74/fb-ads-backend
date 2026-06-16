const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// সার্ভার চেক করার জন্য হোম রুট
app.get('/', (req, res) => {
  res.send('IDMC Ads Backend is running perfectly!');
});

// মেইন এপিআই রুট যা মেটা থেকে ডেটা আনবে
app.post('/api/insights', async (req, res) => {
  try {
    const { campaignId } = req.body;
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID বা Ad ID প্রয়োজন' });
    }

    if (!accessToken) {
      return res.status(500).json({ error: 'Meta Access Token সার্ভারে সেট করা নেই।' });
    }

    const fields = 'campaign_name,spend,impressions,clicks,reach,cpc,cpm';
    const metaUrl = `https://graph.facebook.com/v25.0/${campaignId}/insights?fields=${fields}&access_token=${accessToken}`;

    const response = await fetch(metaUrl);
    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    res.json({ success: true, report: data.data[0] || null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'সার্ভার ইন্টারনাল এরর' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));