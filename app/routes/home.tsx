import type {Route} from "./+types/home";
import Navbar from "~/componentes/Navbar";
import CurriculoCard from "~/componentes/CurriculoCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useLocation, useNavigate} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
    return [
        {title: "ScoreWise"},
        {name: "descrição", content: "Feedback inteligente para seu currículo!"},
    ];
}

export default function Home() {

    const {auth, kv} = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);

    useEffect(() => {
        if (!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated])

    useEffect(() => {
        const loadResumes = async () => {
            setLoadingResumes(true);

            const resumes = (await kv.list('resume:*', true)) as KVItem[];

            const parsedResumes = resumes?.map((resume) => (
                JSON.parse(resume.value) as Resume
            ))

            setResumes(parsedResumes || []);
            setLoadingResumes(false);
        }

        loadResumes()
    }, []);


    return <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
        <Navbar/>
        <section className="main-section">
            <div className="page-heading py-16">
                <h1>Acompanhe suas candidaturas & avaliações de currículo</h1>
                {!loadingResumes && resumes?.length === 0 ? (
                    <h2>Nenhum currículo encontrado. Faça o upload do seu primeiro currículo para receber o
                        feedback.</h2>
                ) : (
                    <h2>Revise suas candidaturas e confira o feedback fornecido por IA</h2>
                )}
            </div>

            {loadingResumes && (
                <div className="flex flex-col items-center justify-center">
                    <img src="/images/resume-scan-2.gif" className="w-[200px]" />
                </div>
            )}

            {!loadingResumes && resumes.length > 0 && (
                <div className="resumes-section">
                    {resumes.map((resume) => (
                        <CurriculoCard key={resume.id} resume={resume} />
                    ))}
                </div>
            )}

            {!loadingResumes && resumes?.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-10 gap-4">
                    <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                        Faça o upload do currículo
                    </Link>
                </div>
            )}
        </section>
    </main>
}
