import {type FormEvent, useState} from "react";
import Navbar from "~/componentes/Navbar";

const Upload: () => React.JSX.Element = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

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
                                <input type="text" name="company-name" placeholder="Nome da Empresa" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Cargo</label>
                                <input type="text" name="job-title" placeholder="Cargo" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Descrição da vaga</label>
                                <textarea rows={5} name="job-description" placeholder="Descrição da vaga" id="job-description" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">Upload do currículo</label>
                                <div>Uploader</div>
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