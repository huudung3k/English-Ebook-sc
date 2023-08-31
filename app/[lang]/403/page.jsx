"use client"

import { Button, Card, Link, Text } from "@nextui-org/react";

export default function Custom403() {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Card className="!w-[30rem] !h-96 flex items-center justify-center">
                <Card.Body className="flex flex-col items-center justify-center gap-8">
                    <Text size="$3xl">403 - Forbidden</Text>
                    <Text size="$xl">Please sign in as administrator</Text>
                    <Link href="/"><Button>Home</Button></Link>
                </Card.Body>
            </Card>
        </div>
    )
};
