"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react";

export default function Home() {
  const features = [
    { icon: <Zap className="h-6 w-6 text-yellow-500" />, title: "Fast Delivery", description: "Get your gadgets in record time." },
    { icon: <Shield className="h-6 w-6 text-green-500" />, title: "Secure Payment", description: "Safe and encrypted transactions." },
    { icon: <Sparkles className="h-6 w-6 text-purple-500" />, title: "AI Assistant", description: "Find exactly what you need with AI." },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary to-background">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Future of Electronics <br />
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Shopping is Here</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Discover state-of-the-art gadgets with our AI-powered semantic search. Personalized recommendations made just for you.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/shop">
              <Button size="lg" className="rounded-full px-8">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-full px-8">
              Explore Collections
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow border-none bg-secondary/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center flex flex-col items-center">
                  <div className="mb-4 bg-background p-4 rounded-2xl shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Categories / Call to Action */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h2 className="text-4xl font-bold mb-6">Experience Better Shopping</h2>
          <p className="text-primary-foreground/80 mb-10 max-w-xl text-lg">
            Our AI Shopping Assistant knows exactly what you're looking for. From technical specs to daily use cases, just ask.
          </p>
          <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-full px-12">
            Try AI Assistant
          </Button>
        </div>
      </section>
    </div>
  );
}
