import {type FormEvent, useState} from "react";
import Navbar from "~/componentes/Navbar";
import FileUploader from "~/componentes/FileUploader";

const Upload: () => React.JSX.Element = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null): void => {
        setFile(file)
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form); //extrair detalhes como nome da empresa, descrição da vaga...

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        console.log ({
            companyName, jobTitle, jobDescription, file
        })

    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar/>
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Feedback inteligente para seu emprego dos sonhos</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full"/>
                        </>
                    ) : (
                        <h2>Envie seu currículo para uma nota ATS e dicas de melhoria</h2>
                    )}
                    {!isProcessing && (
                        <form id="uploaf-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Nome da Empresa</label>
                                <input type="text" name="company-name" placeholder="Nome da Empresa" id="company-name"/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Cargo</label>
                                <input type="text" name="job-title" placeholder="Cargo" id="job-title"/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Descrição da vaga</label>
                                <textarea rows={5} name="job-description" placeholder="Descrição da vaga"
                                          id="job-description"/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">Upload do currículo</label>
                                <FileUploader onFileSelect={handleFileSelect}/>
                            </div>

                            <button className="primary-button" type="submit"> Analise o currículo</button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Upload


