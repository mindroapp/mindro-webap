
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, User } from "lucide-react";
import MarketingLayout from "@/components/layouts/MarketingLayout";
import SEO from "@/components/SEO";

const BlogPage: React.FC = () => {
  // Mock blog data
  const blogPosts = [
    {
      id: 1,
      title: "Como a tecnologia está transformando a prática da psicologia clínica",
      excerpt: "Descubra como as novas ferramentas digitais estão revolucionando o atendimento em saúde mental e ampliando o acesso ao tratamento.",
      author: "Dra. Ana Carolina Silva",
      date: "12 Mai 2025",
      readTime: "8 min",
      category: "Tecnologia",
      image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      title: "Terapia online: eficácia comprovada por estudos recentes",
      excerpt: "Pesquisas recentes demonstram que a terapia online pode ter resultados tão eficazes quanto o atendimento presencial. Saiba mais sobre esses estudos.",
      author: "Dr. Marcos Oliveira",
      date: "03 Mai 2025",
      readTime: "6 min",
      category: "Pesquisa",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      title: "Gestão financeira eficiente para clínicas de psicologia",
      excerpt: "Aprenda estratégias práticas para otimizar a gestão financeira do seu consultório ou clínica e aumentar sua rentabilidade.",
      author: "Fernanda Costa",
      date: "28 Abr 2025",
      readTime: "5 min",
      category: "Gestão",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 4,
      title: "Como usar a tecnologia para melhorar a experiência dos seus pacientes",
      excerpt: "Ferramentas digitais podem fazer toda a diferença na experiência dos seus pacientes. Saiba como implementá-las em sua prática clínica.",
      author: "Dr. Paulo Mendes",
      date: "15 Abr 2025",
      readTime: "7 min",
      category: "Tecnologia",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ];

  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-indigo-700">Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conteúdo exclusivo para profissionais de saúde mental sobre tecnologia, 
            gestão de consultório, pesquisas e tendências da área.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex-grow">
            <Input placeholder="Buscar no blog" className="w-full" />
          </div>
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="technology">Tecnologia</SelectItem>
              <SelectItem value="research">Pesquisa</SelectItem>
              <SelectItem value="management">Gestão</SelectItem>
              <SelectItem value="clinical">Prática Clínica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.readTime} de leitura</span>
                  </div>
                </div>
                <CardTitle className="text-xl hover:text-indigo-700 transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-1" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{post.date}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button variant="outline" className="mx-2">Artigos Anteriores</Button>
          <Button className="bg-indigo-700 hover:bg-indigo-800 mx-2">Próximos Artigos</Button>
        </div>

        <div className="mt-16 bg-indigo-50 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">Receba nosso conteúdo</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Inscreva-se em nossa newsletter para receber artigos, tutoriais e 
            novidades sobre saúde mental e tecnologia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Seu melhor email" className="flex-grow" />
            <Button className="bg-indigo-700 hover:bg-indigo-800 whitespace-nowrap">
              Inscrever-se
            </Button>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default BlogPage;
