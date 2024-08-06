import { connect } from "@/server/db/connect";
import Record from "@/server/schema/record";

export async function POST(req: Request) {
    try {
        // await connect();

        // const body = await req.json();

        // const record = await Record.findOne({ student_code: body.student_code });

        // if (record) {
        //     await Record.replaceOne({ student_code: body.student_code }, body);
        // } else {
        //     await Record.create(body);
        // }

        // return Response.json({ message: "Record is submitted successfully." });
        return Response.json({ error: "Internal Server Error" }, { status: 500 });

    } catch (error) {
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}