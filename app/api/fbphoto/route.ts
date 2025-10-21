import { NextResponse } from "next/server";
import axios, {AxiosError} from "axios";
import { corsHeaders } from "@/lib/corsHeaders";


export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
    const pageId = process.env.FB_PAGE_ID;
    const pageAccessToken = process.env.FB_PAGE_ACCESS_TOKEN;

    if(!pageId || !pageAccessToken) {
        return Response.json(
            { error: 'Missing PageID or Page Access Token in environment variables' },
            { status: 400, headers: corsHeaders }
        );
    }
    try {
         const postsRes = await axios.get(`https://graph.facebook.com/v23.0/${pageId}/posts`, {
         params: {
            fields: 'full_picture,message,attachments{subattachments,media},id,created_time',
            access_token: pageAccessToken,
        },
    });
    const posts = postsRes.data?.data || [];
    
    return  Response.json(
        posts,
        {status: 200, headers: corsHeaders}
    );

    } catch (err) {
         const error = err as AxiosError;
    console.error('Facebook API Error:', error.response?.data || error.message);

    return Response.json(
      {
        error: 'Failed to fetch posts from Facebook',
        details: error.response?.data || null,
      },
      { status: 500, headers: corsHeaders }
        );
    }
}