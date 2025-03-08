
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { 
  HelpCircle, 
  RefreshCw, 
  AlertTriangle, 
  FileText,
  Shield,
  Clock,
  Ban
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/hooks/useAdmin';
import RuleEditor from '@/components/RuleEditor';

// Initial rule content
const initialRules = {
  questions: [
    {
      question: "1. Question: Your modification does not work with my server, it produces conflicts.",
      answer: "Answer: I create modifications based on vanilla DayZ, which means a minimum of conflicts and a complete absence of Crash logs and the appearance of unnecessary RPT logs. I am not responsible for assemblies from other private developers, server assemblies from 50 modifications."
    },
    {
      question: "2. Question: Can I make retextures on Weapons or Clothes?",
      answer: 'Answer: Yes, you can do it. for this, convenient "Zbytek" selections and a convenient modification structure have been made so that you can add object re-textures. At most you may have a problem when updating the modification, you will need to copy all config files to the new version and your retextures if you made changes.'
    }
  ],
  updates: [
    "Updating my mods after a new patch from Bohemia, if a malfunction is detected, is free.",
    "After updating mods from other authors, adjusting my mods costs an additional fee.",
    "Updates adding new content\\functionality to mods\\new mod server - at the discretion of the author and\\or for an additional fee.",
    "If you have changed a mod and you need adjustments to my purchased mods or you want to change it - adjustments will cost an additional fee.",
    "Money can be returned within 12 hours after receiving the role/mod files."
  ],
  disclaimer: "Rules are subject to change, you are 100% responsible for following the rules, ignorance is not an excuse. Synced Community reserves the right to ban without reason. Clipping or recording gameplay is for your own sake, to help keep the community safe & free of cheaters, you as a Member of Synced, are liable to clip your own gameplay, due to the influx of cheaters in PC Gaming. If you cannot provide clips & you&apos;re &quot;sus&quot; or suspicious to the Community, bans may be issued for suspected cheating activity.",
  terms: [
    "It is forbidden to sell/distribute/transfer this product to third parties.",
    'Any rental of server assemblies with installed "franchise" mods is prohibited.',
    "The product is purchased for 1 server (project).",
    "It is forbidden to unpack and use any parts of this mod in other works (scripts, models).",
    "It is forbidden to upload the Server side of the mod to the STEAM workshop."
  ]
};

// Rule section component
const RuleSection = ({ 
  title, 
  icon, 
  iconColor = "text-primary", 
  children,
  delay = 0,
  onEdit,
  canEdit = false
}: { 
  title: string; 
  icon: React.ReactNode; 
  iconColor?: string;
  children: React.ReactNode;
  delay?: number;
  onEdit?: (content: string) => void;
  canEdit?: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6,
        delay: delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="glass-panel rounded-xl p-6 mb-8 relative"
    >
      <div className="flex items-center mb-4">
        <div className={cn("mr-3", iconColor)}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-shine">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  );
};

// Question and answer component
const QA = ({ question, answer, onEdit, canEdit = false }: { 
  question: string; 
  answer: string;
  onEdit?: (newAnswer: string) => void;
  canEdit?: boolean;
}) => {
  return (
    <div className="border-l-4 border-primary/30 pl-4 py-2 relative">
      <h3 className="font-semibold text-white mb-2">{question}</h3>
      <p className="text-gray-300 text-sm">{answer}</p>
      {canEdit && onEdit && (
        <RuleEditor 
          title="Answer" 
          content={answer} 
          onSave={onEdit} 
        />
      )}
    </div>
  );
};

// Numbered rule item component
const RuleItem = ({ 
  number, 
  text,
  warning = false,
  onEdit,
  canEdit = false
}: { 
  number: number | string; 
  text: string;
  warning?: boolean;
  onEdit?: (newText: string) => void;
  canEdit?: boolean;
}) => {
  return (
    <div className="flex relative">
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0",
        warning ? "bg-red-500/20 text-red-400" : "bg-primary/20 text-primary-foreground"
      )}>
        {number}
      </div>
      <p className={cn(
        "text-gray-300 pt-1",
        warning && "text-red-400"
      )}>{text}</p>
      {canEdit && onEdit && (
        <RuleEditor 
          title={`Rule ${number}`} 
          content={text} 
          onSave={onEdit} 
        />
      )}
    </div>
  );
};

const Rules: React.FC = () => {
  const { isAdmin } = useAdmin();
  
  // Use localStorage to persist rules across page reloads
  const [rules, setRules] = useState(() => {
    const savedRules = localStorage.getItem('breathe-rules');
    return savedRules ? JSON.parse(savedRules) : initialRules;
  });

  // Save rules to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('breathe-rules', JSON.stringify(rules));
  }, [rules]);

  // Update question handlers
  const handleUpdateQuestion = (index: number, newAnswer: string) => {
    const newQuestions = [...rules.questions];
    newQuestions[index] = {
      ...newQuestions[index],
      answer: newAnswer
    };
    setRules({
      ...rules,
      questions: newQuestions
    });
  };

  // Update update rule handlers
  const handleUpdateUpdate = (index: number, newText: string) => {
    const newUpdates = [...rules.updates];
    newUpdates[index] = newText;
    setRules({
      ...rules,
      updates: newUpdates
    });
  };

  // Update disclaimer handler
  const handleUpdateDisclaimer = (newText: string) => {
    setRules({
      ...rules,
      disclaimer: newText
    });
  };

  // Update terms handler
  const handleUpdateTerm = (index: number, newText: string) => {
    const newTerms = [...rules.terms];
    newTerms[index] = newText;
    setRules({
      ...rules,
      terms: newTerms
    });
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl pb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold mb-6 text-shine">Breathe Mods Rules</h1>
          <div className="glass-panel rounded-xl p-4 inline-block">
            <p className="text-gray-300">Please read carefully and make sure you understand all terms before purchasing mods.</p>
          </div>
        </motion.div>

        <RuleSection 
          title="[1] QUESTIONS" 
          icon={<HelpCircle size={24} />} 
          iconColor="text-blue-400"
          delay={0.1}
          canEdit={isAdmin}
        >
          {rules.questions.map((qa, index) => (
            <QA
              key={index}
              question={qa.question}
              answer={qa.answer}
              canEdit={isAdmin}
              onEdit={(newAnswer) => handleUpdateQuestion(index, newAnswer)}
            />
          ))}
        </RuleSection>

        <RuleSection 
          title="[2] UPDATES" 
          icon={<RefreshCw size={24} />} 
          iconColor="text-green-400"
          delay={0.2}
          canEdit={isAdmin}
        >
          <div className="space-y-3">
            {rules.updates.map((update, index) => (
              <RuleItem 
                key={index}
                number={index + 1} 
                text={update} 
                canEdit={isAdmin}
                onEdit={(newText) => handleUpdateUpdate(index, newText)}
              />
            ))}
          </div>
          
          <div className="mt-6 bg-primary/10 p-4 rounded-lg flex items-center">
            <Clock className="w-5 h-5 text-primary mr-2" />
            <span className="text-primary-foreground text-sm">Subsequent updates are FREE</span>
          </div>
          
          <div className="mt-2 bg-primary/10 p-4 rounded-lg flex items-center">
            <Shield className="w-5 h-5 text-primary mr-2" />
            <span className="text-primary-foreground text-sm">All my server-side mods come with IP whitelist protection!</span>
          </div>
        </RuleSection>

        <RuleSection 
          title="[3] DISCLAIMER" 
          icon={<AlertTriangle size={24} />} 
          iconColor="text-yellow-400"
          delay={0.3}
          canEdit={isAdmin}
        >
          <div className="relative">
            <p className="text-gray-300">
              {rules.disclaimer}
            </p>
            {isAdmin && (
              <RuleEditor 
                title="Disclaimer" 
                content={rules.disclaimer} 
                onSave={handleUpdateDisclaimer} 
              />
            )}
          </div>
        </RuleSection>

        <RuleSection 
          title="[4] TERMS OF USE AND POLICY" 
          icon={<FileText size={24} />} 
          iconColor="text-purple-400"
          delay={0.4}
          canEdit={isAdmin}
        >
          <div className="space-y-3">
            {rules.terms.map((term, index) => (
              <RuleItem 
                key={index}
                number={index + 1} 
                text={term} 
                canEdit={isAdmin}
                onEdit={(newText) => handleUpdateTerm(index, newText)}
              />
            ))}
          </div>
        </RuleSection>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 text-center mt-8"
        >
          <div className="flex justify-center mb-4">
            <Ban size={32} className="text-red-400" />
          </div>
          <p className="text-red-400 font-semibold">
            ❗ In case of violation of at least one point of the rules, you can be blocked or lose all mods without the possibility of a refund ❗
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Rules;
