import {usePuterStore} from "~/lib/puter";

import React, {useEffect} from "react";
import {useLocation, useNavigate} from "react-router";

export const meta = () => ([
    {title: 'ScoreWise | Autenticação'},
    {name: 'descrição', content: 'Logue na sua conta'},
])


const Auth: () => React.JSX.Element = () => {

    const {isLoading, auth} = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    // lida com o redirecionamento caso o usuário tente acessar uma rota "restrita" sem estar logado
    //(será barrado na autenticação, mas assim que logar será redirecionado para pagina que queria)
    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover main-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Bem Vindo!</h1>
                        <h2>Logue Para Continuar Sua Jornada Profissional</h2>
                    </div>
                    <div>
                        {isLoading ? ( //se estiver carregando:
                            <button className="auth-button animate-pulse">
                                <p>Logando você...</p>
                            </button>
                        ) : ( //se não estiver carregando:
                            <>
                                {auth.isAuthenticated ? (
                                    <button className="auth-button " onClick={auth.signOut}>
                                        <p>Sair</p>
                                    </button>
                                ) : (
                                    <button className="auth-button " onClick={auth.signIn}>
                                        <p>Login</p>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}
export default Auth;