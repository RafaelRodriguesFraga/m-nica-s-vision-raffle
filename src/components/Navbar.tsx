import { Link, useNavigate } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSecretButton, setShowSecretButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const adminRef = doc(db, "admins", user.uid);
          const adminSnap = await getDoc(adminRef);
          
          if (adminSnap.exists()) {
            setIsAdmin(true);
            setShowSecretButton(false);
          } else {
            setIsAdmin(false);
            await signOut(auth);
          }
        } catch (error) {
          console.error("Erro ao verificar admin:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // O clique duplo agora apenas "destrava" o botão secreto na tela de forma segura
  const handleSecretTrigger = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdmin) {
      navigate({ to: "/admin" });
    } else {
      setShowSecretButton((prev) => !prev);
    }
  };

  // Função de login disparada por um clique único e limpo no botão destravado
  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Força o comportamento de seleção de conta para evitar loops automáticos
      provider.setCustomParameters({ prompt: "select_account" });
      
      await signInWithPopup(auth, provider);
      navigate({ to: "/admin" });
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* LOGO: Dois cliques aqui alternam a exibição do botão de login secreto */}
        <div 
          onDoubleClick={handleSecretTrigger}
          className="flex items-center gap-2 select-none cursor-pointer"
          title="Rifa da Mônica"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
            <Heart className="h-4 w-4" fill="currentColor" />
          </span>
          <span className="font-display text-lg font-semibold leading-none text-foreground">
            Rifa da Mônica
          </span>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
          <a href="#sobre" className="hover:text-foreground">Sobre</a>
          <a href="#numeros" className="hover:text-foreground">Números</a>
          <a href="#compartilhar" className="hover:text-foreground">Compartilhar</a>
        </nav>
        
        <div className="flex items-center gap-2">
          {/* Botão Secreto de Login (só aparece após o clique duplo) */}
          {showSecretButton && !isAdmin && (
            <button
              onClick={handleLogin}
              disabled={loading}
              className="rounded-full bg-muted border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent cursor-pointer"
            >
              {loading ? "Conectando..." : "Entrar como Admin"}
            </button>
          )}

          {isAdmin ? (
            <Link
              to="/admin"
              className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-[var(--shadow-soft)] transition hover:bg-foreground/90 sm:text-sm cursor-pointer"
            >
              Painel Admin
            </Link>
          ) : (
            <a
              href="#numeros"
              className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:brightness-105 sm:text-sm cursor-pointer"
            >
              Participar
            </a>
          )}
        </div>
      </div>
    </header>
  );
}