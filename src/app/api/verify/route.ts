import { connect } from "@/server/db/connect";
import Record from "@/server/schema/record";

export async function POST(req: Request) {
    try {
        await connect();

        const body = await req.json();

        const record = await Record.findOne({ student_code: body.student_code });

        if (!record) {
            return Response.json({}, { status: 404 });
        }

        return Response.json({}, { status: 200 });

    } catch (error) {
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}