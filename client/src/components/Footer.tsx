import { Heart } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white py-6 mt-12 border-t border-slate-700">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm md:text-base">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <p>
              Este servico e gratuito e mantido com apoio da comunidade.
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/" className="hover:text-slate-300 transition-colors">
              Início
            </Link>
            <Link href="/docs" className="hover:text-slate-300 transition-colors">
              Documentação
            </Link>
          </div>
          <div className="text-sm md:text-base text-center md:text-right">
            <p className="mb-2">Se ele te ajudou, considere fazer uma doacao</p>
            <div className="bg-slate-800 rounded px-4 py-2 inline-block">
              <p className="font-mono text-yellow-400">
                PIX: eleno.ramos@gmail.com
              </p>
              <p className="text-xs text-slate-400 mt-1">R$5 ja ajuda a manter o servidor no ar</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
