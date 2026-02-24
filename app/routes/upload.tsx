import {type FormEvent, useState} from "react";
import Navbar from "~/componentes/Navbar";
import FileUploader from "~/componentes/FileUploader";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions, AIResponseFormat} from "../../constantes";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";

const Upload: () => React.JSX.Element = () => {
    const {auth, isLoading, fs, ai, kv} = usePuterStore(); // fs (file storage) e kv (key value storage functions)
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null): void => {
        setFile(file)
    }

    const handleAnalyze = async ({companyName, jobTitle, jobDescription, file}: {
        companyName: string,
        jobTitle: string,
        jobDescription: string,
        file: File
    }) => {
        try {
            setIsProcessing(true);
            setStatusText('Fazendo o upload do arquivo...');
            const uploadedFile = await fs.upload([file]); //fazendo o upload do arquivo para o armazenamento do puter
            if (!uploadedFile) return setStatusText('Error: Falha no upload o arquivo');

            setStatusText('Convertendo para imagem...');
            const imageFile = await convertPdfToImage(file);
            if (!imageFile.file) return setStatusText('Error: Falha ao converter o PDF para imagem'); // caso o arquivo de imagem nao exista

            setStatusText(' Fazendo o upload da imagem...');
            const uploadedImage = await fs.upload([imageFile.file]);
            if (!uploadedImage) return setStatusText('Error: Falha ao fazer o upload da imagem'); // falha ao carregar a imagem

            setStatusText('Preparando dados...');
            const uuid = generateUUID();
            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName, jobTitle, jobDescription,
                feedback: '',
            }
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText('Analisando...');

            const feedback = await ai.feedback( //função que vem direto do puter e usa funcionalidades de ia próprias
                uploadedFile.path, //infos adicionais
                prepareInstructions({jobTitle, jobDescription, AIResponseFormat})
            )
            if (!feedback) return setStatusText('Error: Falha em analisar o currículo');

            const feedbackText = typeof feedback.message.content === 'string'
                ? feedback.message.content // se sim, o feedback é extraido facilmente
                : feedback.message.content[0].text; //extrai o primeiro feedback

            data.feedback = JSON.parse(feedbackText);
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            setStatusText('Analise completa, redirecionando...');
            navigate(`/resume/${uuid}`);

        } catch (err: any) {
            console.error("Erro:", err);
            setStatusText('Erro: ' + JSON.stringify(err));
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form); //extrair detalhes como nome da empresa, descrição da vaga...

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) return; //verifica se não tem arquivo e sai da function

        handleAnalyze({companyName, jobTitle, jobDescription, file});
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