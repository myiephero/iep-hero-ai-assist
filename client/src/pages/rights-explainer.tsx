import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, BookOpen, Scale, Shield, FileText, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface RightsSection {
  id: string;
  title: string;
  category: 'idea' | 'section504' | 'ferpa' | 'general';
  content: string;
  plainLanguage: string;
  keyPoints: string[];
  whenToUse: string;
}

const rightsData: RightsSection[] = [
  {
    id: 'fape',
    title: 'Free Appropriate Public Education (FAPE)',
    category: 'idea',
    content: 'Under IDEA, every child with a disability has the right to a free appropriate public education (FAPE) that emphasizes special education and related services designed to meet their unique needs and prepare them for further education, employment, and independent living.',
    plainLanguage: 'Your child has the right to special education services at no cost to you. These services must be appropriate for your child\'s specific needs and help prepare them for their future.',
    keyPoints: [
      'Education must be free of charge to parents',
      'Services must be appropriate for your child\'s unique needs',
      'Must be provided in the least restrictive environment',
      'Includes both special education and related services (like therapy)'
    ],
    whenToUse: 'Use this right when the school says they can\'t provide needed services, when services are being cut, or when you\'re asked to pay for something that should be covered.'
  },
  {
    id: 'evaluation-rights',
    title: 'Right to Evaluation',
    category: 'idea',
    content: 'Parents have the right to request an evaluation if they suspect their child has a disability. The school must evaluate in all areas of suspected disability using a variety of assessment tools and strategies.',
    plainLanguage: 'You can ask the school to test your child if you think they might have a disability. The school must do a complete evaluation, not just one test.',
    keyPoints: [
      'You can request an evaluation at any time',
      'School must respond within a reasonable time (usually 60 days)',
      'Evaluation must be comprehensive and in your native language',
      'You have the right to an independent evaluation if you disagree'
    ],
    whenToUse: 'Use when you suspect your child has a disability, when current services aren\'t working, or every 3 years for re-evaluation.'
  },
  {
    id: 'iep-participation',
    title: 'IEP Team Participation',
    category: 'idea',
    content: 'Parents are equal members of the IEP team and must be invited to participate in all meetings where the IEP is discussed, developed, or revised.',
    plainLanguage: 'You are an equal partner in making decisions about your child\'s education. You must be included in all important meetings.',
    keyPoints: [
      'You are an equal member of the IEP team',
      'Meetings must be scheduled at mutually convenient times',
      'You can bring advocates, lawyers, or other supporters',
      'You can request additional team members attend'
    ],
    whenToUse: 'Use when meetings are scheduled without consulting you, when your input is ignored, or when you need additional support at meetings.'
  },
  {
    id: 'least-restrictive',
    title: 'Least Restrictive Environment (LRE)',
    category: 'idea',
    content: 'Children with disabilities must be educated with non-disabled children to the maximum extent appropriate. Removal from the regular educational environment should occur only when education in regular classes with supplementary aids and services cannot be achieved satisfactorily.',
    plainLanguage: 'Your child should be in regular classes with other children as much as possible. They should only be removed when absolutely necessary.',
    keyPoints: [
      'Preference for regular classroom placement',
      'Supplementary aids and services should be provided first',
      'Removal should be justified with data',
      'Continuum of placement options must be available'
    ],
    whenToUse: 'Use when the school wants to place your child in a more restrictive setting without trying supports in regular classes first.'
  },
  {
    id: 'procedural-safeguards',
    title: 'Procedural Safeguards',
    category: 'idea',
    content: 'Parents have specific procedural rights including prior written notice, consent requirements, access to records, and the right to file complaints or request due process hearings.',
    plainLanguage: 'You have specific legal protections. The school must follow certain procedures and get your permission for many things.',
    keyPoints: [
      'Right to prior written notice before changes',
      'Right to consent to evaluations and initial services',
      'Right to access your child\'s educational records',
      'Right to file complaints and request hearings'
    ],
    whenToUse: 'Use when the school makes changes without proper notice, when you disagree with decisions, or when your other rights are violated.'
  },
  {
    id: 'section504-basics',
    title: 'Section 504 Protection',
    category: 'section504',
    content: 'Section 504 prohibits discrimination based on disability and requires schools to provide reasonable accommodations to ensure equal access to education.',
    plainLanguage: 'Schools cannot treat your child differently because of their disability. They must make reasonable changes to help your child participate.',
    keyPoints: [
      'Broader definition of disability than IDEA',
      'Focuses on equal access and non-discrimination',
      'Requires reasonable accommodations',
      'Covers students who don\'t qualify for IDEA services'
    ],
    whenToUse: 'Use when your child has accommodations needs but doesn\'t qualify for an IEP, or when facing disability-based discrimination.'
  },
  {
    id: 'ferpa-records',
    title: 'Educational Records Rights (FERPA)',
    category: 'ferpa',
    content: 'Parents have the right to inspect and review their child\'s educational records, request amendments to inaccurate records, and control disclosure of personally identifiable information.',
    plainLanguage: 'You have the right to see all of your child\'s school records and control who else can see them.',
    keyPoints: [
      'Right to inspect records within 45 days of request',
      'Right to request amendments to inaccurate information',
      'Right to control who sees records',
      'Right to file complaints about violations'
    ],
    whenToUse: 'Use when you need to see records, when records contain errors, or when information is shared without permission.'
  }
];

export default function RightsExplainer() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('idea');

  // Check if user has Hero plan access
  const hasHeroAccess = user?.planStatus === 'heroOffer' || 
                        user?.email === 'parent@demo.com';

  if (!hasHeroAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/dashboard-parent">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <Card className="text-center p-8">
            <CardContent>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Know Your Rights</h2>
              <p className="text-gray-600 mb-6">
                Get plain-language explanations of IDEA, Section 504, and other important rights. Available with Hero Plan ($495/year).
              </p>
              <Link href="/subscribe">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  Upgrade to Hero Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const filteredRights = rightsData.filter(right => {
    const matchesSearch = searchTerm === '' || 
      right.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      right.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      right.plainLanguage.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || right.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'idea': return <BookOpen className="w-4 h-4" />;
      case 'section504': return <Shield className="w-4 h-4" />;
      case 'ferpa': return <FileText className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'idea': return 'bg-blue-100 text-blue-800';
      case 'section504': return 'bg-green-100 text-green-800';
      case 'ferpa': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard-parent">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Know Your Rights</h1>
              <p className="text-gray-600">Plain-language explanations of IDEA, Section 504, and other important rights</p>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              Hero Plan
            </Badge>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search rights and protections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="idea">IDEA</TabsTrigger>
            <TabsTrigger value="section504">Section 504</TabsTrigger>
            <TabsTrigger value="ferpa">FERPA</TabsTrigger>
            <TabsTrigger value="all">All Rights</TabsTrigger>
          </TabsList>

          <TabsContent value={activeCategory} className="mt-6">
            <div className="space-y-6">
              {filteredRights.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No rights found matching your search.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredRights.map((right) => (
                  <Card key={right.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {getCategoryIcon(right.category)}
                          {right.title}
                        </CardTitle>
                        <Badge className={`text-xs ${getCategoryColor(right.category)}`}>
                          {right.category.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-800 mb-2">In Plain Language:</h4>
                        <p className="text-green-700 bg-green-50 p-3 rounded-lg">{right.plainLanguage}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Points:</h4>
                        <ul className="space-y-1">
                          {right.keyPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="text-blue-600 mt-1">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-orange-800 mb-2">When to Use This Right:</h4>
                        <p className="text-orange-700 bg-orange-50 p-3 rounded-lg text-sm">{right.whenToUse}</p>
                      </div>

                      <details className="mt-4">
                        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                          View Legal Language
                        </summary>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                          {right.content}
                        </div>
                      </details>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Reference */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Reference</CardTitle>
            <CardDescription>Important contacts and next steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
                <p className="text-blue-800">Contact your state's Parent Training and Information Center (PTI) for free advocacy support.</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">File a Complaint?</h4>
                <p className="text-green-800">Contact your state department of education to file formal complaints about violations.</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Legal Advice?</h4>
                <p className="text-purple-800">Consider consulting with a special education attorney for complex situations.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}