import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

function AccordionDemo() {
    return (
        <Accordion type="single" collapsible className="py-4 bg-white px-4 text-m">
            <AccordionItem value="item-1">
                <AccordionTrigger>How to upload files?</AccordionTrigger>
                <AccordionContent>
                    If you would like to provide exam or solution files, you can click "Upload" in the bar.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>How to download files?</AccordionTrigger>
                <AccordionContent>
                    If you would like to download exam or solution files, you can click "Course" in the bar and then search the particular course to download files.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Why do files I uploaded fail?</AccordionTrigger>
                <AccordionContent>
                    The reasons why files you upload do not eventually appear on the website can vary depending on the case.
                    Some common reasons include incorrect formats, errors or ambiguity in file content, input errors in course names or commencement years,
                    or the presence of relevant files for the course in that particular year.
                    If you still have any problem, please feel free to contact us.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default async function Help() {

    return (
        <div className="py-4 bg-white px-4 flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
            <h1 className="py-4 bg-white px-4 text-xl font-bold">Help</h1>
            <p className="py-4 bg-white px-4 text-m">
                Welcome to Quiztory! Your go-to destination for seamless exam file sharing.
                Whether you're here to upload valuable resources or download essential materials, we're here to make your academic journey smoother. Explore, contribute, and excel together!
                Here are some frequent asked questions. If you have any further question, please feel free to contact us.
            </p>

            <div className="bg-white px-4">
                <h2 className="font-heading mt-12 scroll-m-20 border-b-2 pt-4 text-l font-semibold tracking-tight first:mt-0">
                    FAQ
                </h2>
            </div>
            <AccordionDemo />
        </div>
    );
}