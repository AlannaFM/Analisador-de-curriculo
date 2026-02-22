import type {Route} from "./+types/home";
import Navbar from "~/componentes/Navbar";
import {resumes} from "../../constantes";
import CurriculoCard from "~/componentes/CurriculoCard";
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";
import {useEffect} from "react";

export function meta({}: Route.MetaArgs) {
    return [
        {title: "ScoreWise"},
        {name: "descrição", content: "Feedback inteligente para seu currículo!"},
    ];
}

export default function Home() {

    const { auth } = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated])


    return <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
        <Navbar/>
        <section className="main-section">
            <div className="page-heading py-16">
                <h1>Acompanhe suas candidaturas & avaliações de currículo</h1>
                <h2>Revise suas candidaturas e confira o feedback fornecido por IA</h2>
            </div>

            {resumes.length > 0 && (
                <div className="resumes-section">
                    {resumes.map((resume) => (
                        <CurriculoCard key={resume.id} resume={resume}/>
                    ))}
                </div>
            )}
        </section>
    </main>
}
