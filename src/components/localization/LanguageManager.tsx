
import React, { useState, createContext, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Globe, Languages, Users, MapPin } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  progress: number;
  isActive: boolean;
}

interface TranslationContextType {
  currentLanguage: string;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const LanguageManager = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const { toast } = useToast();

  const supportedLanguages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', progress: 100, isActive: true },
    { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬', progress: 85, isActive: true },
    { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬', progress: 75, isActive: true },
    { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬', progress: 80, isActive: true },
    { code: 'pid', name: 'Nigerian Pidgin', nativeName: 'Naija', flag: '🇳🇬', progress: 60, isActive: false },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', progress: 45, isActive: false }
  ];

  const marketInsights = [
    { region: 'Port Harcourt', languages: ['English', 'Igbo', 'Pidgin'], percentage: 95 },
    { region: 'Lagos', languages: ['English', 'Yoruba', 'Pidgin'], percentage: 88 },
    { region: 'Abuja', languages: ['English', 'Hausa', 'Pidgin'], percentage: 92 },
    { region: 'Kano', languages: ['English', 'Hausa'], percentage: 78 }
  ];

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    
    toast({
      title: "Language Changed!",
      description: `Interface language changed to ${supportedLanguages.find(l => l.code === languageCode)?.name}`,
    });
  };

  const handleActivateLanguage = (languageCode: string) => {
    toast({
      title: "Language Activated!",
      description: `${supportedLanguages.find(l => l.code === languageCode)?.name} is now available to users.`,
    });
  };

  // Simple translation function (in real app, this would use i18n library)
  const translations: Record<string, Record<string, string>> = {
    en: {
      'welcome': 'Welcome to PhCityRent',
      'find_property': 'Find Your Perfect Property',
      'contact_agent': 'Contact Agent',
      'view_details': 'View Details'
    },
    ha: {
      'welcome': 'Barka da zuwa PhCityRent',
      'find_property': 'Nemo Gidan Da Ya Dace Da Ku',
      'contact_agent': 'Tuntubi Dilali',
      'view_details': 'Duba Cikakkun Bayanai'
    },
    ig: {
      'welcome': 'Nnọọ na PhCityRent',
      'find_property': 'Chọta Ụlọ Kwesịrị Gị',
      'contact_agent': 'Kpọtụrụ Onye Ọrụ',
      'view_details': 'Lee Nkọwa Zuru Ezu'
    },
    yo: {
      'welcome': 'Káàbọ̀ sí PhCityRent',
      'find_property': 'Wa Ile Ti O Bá Yin Mu',
      'contact_agent': 'Pe Aṣoju',
      'view_details': 'Wo Alaye Pipe'
    }
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Multi-Language Support</h2>
        <p className="text-gray-600">Localization for Nigerian markets and international reach</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Languages className="w-5 h-5" />
              <span>Language Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Interface Language</label>
              <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.filter(lang => lang.isActive).map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      <span className="flex items-center space-x-2">
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                        <span className="text-gray-500">({language.nativeName})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Preview</h4>
              <div className="space-y-2 text-sm">
                <p><strong>{t('welcome')}</strong></p>
                <p>{t('find_property')}</p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">{t('contact_agent')}</Button>
                  <Button size="sm">{t('view_details')}</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Translation Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {supportedLanguages.map((language) => (
                <div key={language.code} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span>{language.flag}</span>
                      <span className="font-medium">{language.name}</span>
                      <Badge variant={language.isActive ? 'default' : 'secondary'}>
                        {language.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">{language.progress}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={language.progress} className="flex-1" />
                    {!language.isActive && language.progress > 70 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleActivateLanguage(language.code)}
                      >
                        Activate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Market Language Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {marketInsights.map((market, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{market.region}</h4>
                    <Badge variant="outline">{market.percentage}% coverage</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Primary Languages:</p>
                    <div className="flex flex-wrap gap-1">
                      {market.languages.map((lang, langIndex) => (
                        <Badge key={langIndex} variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const translations: Record<string, Record<string, string>> = {
    en: {
      'welcome': 'Welcome to PhCityRent',
      'find_property': 'Find Your Perfect Property',
      'contact_agent': 'Contact Agent',
      'view_details': 'View Details'
    },
    ha: {
      'welcome': 'Barka da zuwa PhCityRent',
      'find_property': 'Nemo Gidan Da Ya Dace Da Ku',
      'contact_agent': 'Tuntubi Dilali',
      'view_details': 'Duba Cikakkun Bayanai'
    }
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };

  const setLanguage = (code: string) => {
    setCurrentLanguage(code);
  };

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export default LanguageManager;
