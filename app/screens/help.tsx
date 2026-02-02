import React from 'react';
import { View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import Expandable from '@/components/Expandable';
import Section from '@/components/layout/Section';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import AnimatedView from '@/components/AnimatedView';
import Divider from '@/components/layout/Divider';
import ThemedScroller from '@/components/ThemeScroller';
import { useTranslation } from '@/hooks/useTranslation';

export default function HelpScreen() {
  const { t } = useTranslation();

  // FAQ data
  const faqData = [
    {
      id: '1',
      question: t('help.faq1Question'),
      answer: t('help.faq1Answer')
    },
    {
      id: '2',
      question: t('help.faq2Question'),
      answer: t('help.faq2Answer')
    },
    {
      id: '3',
      question: t('help.faq3Question'),
      answer: t('help.faq3Answer')
    },
    {
      id: '4',
      question: t('help.faq4Question'),
      answer: t('help.faq4Answer')
    },
    {
      id: '5',
      question: t('help.faq5Question'),
      answer: t('help.faq5Answer')
    },
    {
      id: '6',
      question: t('help.faq6Question'),
      answer: t('help.faq6Answer')
    },
    {
      id: '7',
      question: t('help.faq7Question'),
      answer: t('help.faq7Answer')
    },
    {
      id: '8',
      question: t('help.faq8Question'),
      answer: t('help.faq8Answer')
    }
  ];

  // Contact information
  const contactInfo = [
    {
      id: 'email',
      type: t('help.emailSupport'),
      value: 'maldives@audifoil.com',
      icon: 'Mail' as const,
      action: () => Linking.openURL('mailto:maldives@audifoil.com')
    },
    {
      id: 'phone',
      type: t('help.phoneSupport'),
      value: '+960 333-FOIL',
      icon: 'Phone' as const,
      action: () => Linking.openURL('tel:+18005556689')
    },
    {
      id: 'hours',
      type: t('help.supportHours'),
      value: t('help.supportHoursValue'),
      icon: 'Clock' as const,
      action: undefined
    }
  ];
  return (
    <View className="flex-1 bg-background dark:bg-dark-primary">
      <Header title={t('help.title')} showBackButton />
      
      <ThemedScroller showsVerticalScrollIndicator={false}>
        <AnimatedView animation="fadeIn" duration={400}>
          {/* FAQ Section */}
          <Section 
            title={t('help.faq')} 
            titleSize="xl" 
            className=" pt-6 pb-2"
          />
          
          <View className="bg-secondary rounded-3xl overflow-hidden">
            {faqData.map((faq) => (
              <Expandable 
                key={faq.id}
                title={faq.question}
                className="py-1 px-4"
              >
                <ThemedText className="text-light-text dark:text-dark-text leading-6">
                  {faq.answer}
                </ThemedText>
              </Expandable>
            ))}
          </View>
          

          
          {/* Contact Section */}
          <Section 
            title={t('help.contactUs')} 
            titleSize="xl" 
            className=" mb-4 mt-14"
            subtitle={t('help.contactSubtitle')}
          />
          
          <View className="bg-secondary rounded-3xl overflow-hidden">
            {contactInfo.map((contact) => (
              <TouchableOpacity 
                key={contact.id}
                onPress={contact.action}
                disabled={!contact.action}
                className="flex-row items-center py-4 px-4 border-b border-border"
              >
                <View className="w-14 h-14 rounded-xl bg-background items-center justify-center mr-4">
                  <Icon name={contact.icon} size={20} />
                </View>
                <View>
                  <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">
                    {contact.type}
                  </ThemedText>
                  <ThemedText className="font-medium">
                    {contact.value}
                  </ThemedText>
                </View>
                {contact.action && (
                  <Icon name="ChevronRight" size={20} className="ml-auto text-light-subtext dark:text-dark-subtext" />
                )}
              </TouchableOpacity>
            ))}
            
            <Button 
              title={t('help.emailUs')} 
              iconStart="Mail"
              className="m-3"
              onPress={() => Linking.openURL('mailto:maldives@audifoil.com')}
            />
          </View>
        </AnimatedView>
      </ThemedScroller>
    </View>
  );
}
