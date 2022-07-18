import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import AnswerInput from '@/components/AnswerInput';
import Header from '@/components/Header';
import ParagraphLabel from '@/components/ParagraphLabel';
import TitleLabel from '@/components/TitleLabel';
import { APP_TITLE } from '@/constants/meta';
import questions from '@/constants/questions';
import useConfetti from '@/hooks/useConfetti';
import useEnter from '@/hooks/useEnter';
import styles from '@/styles/pages/Question.module.scss';

function Question() {
  const router = useRouter();
  const [isValidate, setIsValidate] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState(false);
  const [matches, setMatches] = useState<string[]>([]);
  const [answer, setAnswer] = useState('');

  const id = Number(router.query.id);

  useConfetti(isCorrect);

  useEnter(() => {
    if (!isCorrect) {
      return;
    }
    const ID_DIFF = 1;
    const nextID = id + ID_DIFF;
    // eslint-disable-next-line no-void
    void router.push(`/questions/${nextID}`);
  }, [id, isCorrect]);

  useEffect(() => {
    if (Number.isNaN(id)) {
      return;
    }

    const question = questions[id];
    if (!question) {
      // eslint-disable-next-line no-void
      void router.replace('/');
      return;
    }
    setIsLoading(false);
  }, [id]);

  const { title, paragraph, answer: questionAnswer } = questions[id] ?? {};

  useEffect(() => {
    try {
      const regExp = new RegExp(answer, 'g');
      const result = paragraph.match(regExp);
      setMatches([...(result ?? [])]);
      setIsValidate(true);
    } catch (e) {
      setIsValidate(false);
    } finally {
      setIsCorrect(questionAnswer === answer);
    }
  }, [answer, id]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {APP_TITLE} : {title}
        </title>
      </Head>
      <Header />
      <div className={styles.container}>
        <TitleLabel content={title ?? ''} />
        <ParagraphLabel
          content={paragraph ?? ''}
          matches={matches}
        />
        <AnswerInput bind={[answer, setAnswer]} />
        <div className={styles.message}>
          {!isValidate && <p className={styles.error}>is not validate</p>}
          {isCorrect && (
            <p className={styles.success}>
              press {`'`}ENTER{`'`} to next question
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Question;
