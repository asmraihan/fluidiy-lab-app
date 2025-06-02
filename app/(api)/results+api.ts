import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.EXPO_PUBLIC_DATABASE_URL || '');

export async function POST(request: Request) {
  try {
    const { action, ...body } = await request.json();
    
    // Get results for a specific user
    if (action === 'getResults') {
      const { userId } = body;
      
      if (!userId) {
        return Response.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }

      const results = await sql`
        SELECT * FROM analysis_results 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `;

      return Response.json({ results });
    }

    // Save new analysis result
    if (action === 'saveResult') {
      const { userId, result } = body;

      if (!userId || !result) {
        return Response.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Save result to database
      const savedResult = await sql`
        INSERT INTO analysis_results (user_id, result_data)
        VALUES (
          ${userId}, 
          ${JSON.stringify(result)}
        )
        RETURNING id, created_at
      `;

      return Response.json({
        success: true,
        result: {
          id: savedResult[0].id,
          ...result,
          created_at: savedResult[0].created_at
        }
      });
    }

    // Delete a result
    if (action === 'deleteResult') {
      const { resultId, userId } = body;
      
      console.log('Delete request received:', { resultId, userId });

      if (!resultId || !userId) {
        return Response.json(
          { error: "Result ID and User ID are required" },
          { status: 400 }
        );
      }

      try {
        // Delete the result
        const deleteResult = await sql`
          DELETE FROM analysis_results
          WHERE id = ${resultId}
          AND user_id = ${userId}
          RETURNING id
        `;

        if (deleteResult.length === 0) {
          return Response.json(
            { error: "Result not found" },
            { status: 404 }
          );
        }

        return Response.json({ success: true });
      } catch (error) {
        console.error('Database error:', error);
        return Response.json(
          { error: String(error), success: false },
          { status: 500 }
        );
      }
    }

    return Response.json(
      { error: "Invalid action" },
      { status: 400 }
    );

  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: String(error), success: false },
      { status: 500 }
    );
  }
}