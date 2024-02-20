import React, {useState, useEffect} from 'react';
import { COUNTRIES } from './CountryList';
import styles from './Questions.module.css';

function Questions(props) {

    const [isFetched, setIsFetched] = useState(false)
    const [preparedData, setPreparedData] = useState(null)
    const [preparedQuestion, setPreparedQuestion] = useState(null)
    const [flagSet, setFlagSet] = useState([{country: '', flag:''},{country: '', flag:''},{country: '', flag:''},{country: '', flag:''}])
    const [questionCountry, setQuestionCountry] = useState('')
    const [questionIndex, setQuestionIndex] = useState(0)
    const [isQuestionPrepped, setIsQuestionPrepped] = useState(false)
    const [isCountryPicked, setIsCountryPicked] = useState(false)
    const [isAnswered, setIsAnswered] = useState(false)
    const [preparedAnswer, setPreparedAnswer] = useState(null)
    const [answerIndex, setAnswerIndex] = useState(0)
    const [score, setScore] = useState(0)
    const [questionsAsked, setQuestionsAsked] = useState(0)
    const [reset, setReset] = useState(false)

    const randomCountry = () => {
        let countryNumber = Math.floor(Math.random() * COUNTRIES.length);
        return countryNumber;
    }

    const pickCountry = () => {
        let countryNumber = Math.floor(Math.random() * 4);
        setQuestionCountry(flagSet[countryNumber].country);
        setQuestionIndex(countryNumber);
        setIsQuestionPrepped(true);
    }

    useEffect(() => {
        const getCountryAPI = async () => {
            setReset(false);
            setIsFetched(false);
            let newFlagSet = [...flagSet];
            for (let index = 0; index < 4; index++) {
                const country = COUNTRIES[randomCountry()];
                const url = `https://restcountries.com/v3.1/name/${country}?fullText=true`;
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        let data = await response.json();
                        newFlagSet[index] = { country: country, flag: data[0].flags.png };
                    } else {
                        throw new Error('Error in receiving country data');
                    }
                } catch (error) {
                    console.log('There was an unexpected error:', error);
                }
            }
            setFlagSet(newFlagSet);
            setIsFetched(true);
        }
        if (!isFetched && !isCountryPicked && !isQuestionPrepped) {
        getCountryAPI();
        }
        
    },[reset])

    const noData = <p>There is no data yet.</p>

    const empty = <></>

    const handleClick = (event) => {
        if (!isAnswered) {
        setAnswerIndex(event.target.id);
        setIsAnswered(true);
        console.log(event.target.id);
        }
    }

    const handleNextQuestion = (event) => {
        setIsAnswered(false)
        setIsCountryPicked(false)
        setIsFetched(false)
        setIsQuestionPrepped(false)
        setFlagSet([{country: '', flag:''},{country: '', flag:''},{country: '', flag:''},{country: '', flag:''}])
        setPreparedAnswer(null)
        setPreparedData(null)
        setPreparedQuestion(null)
        setQuestionCountry('')
        setQuestionIndex(0)
        setReset(true)
    }

    const handleResetGame = (event) => {
        setIsAnswered(false)
        setIsCountryPicked(false)
        setIsFetched(false)
        setIsQuestionPrepped(false)
        setFlagSet([{country: '', flag:''},{country: '', flag:''},{country: '', flag:''},{country: '', flag:''}])
        setPreparedAnswer(null)
        setPreparedData(null)
        setPreparedQuestion(null)
        setQuestionCountry('')
        setQuestionIndex(0)
        setQuestionsAsked(0)
        setScore(0)
        setReset(true)
    }

    useEffect(() => {
        if (isFetched) {
            setPreparedData(() => (
                <>
                <ul className={styles.flagBox}>
                    {flagSet.map((item, index) => (
                        <li className={styles.flagItem}>
                            <img onClick={handleClick} className={styles.flag} src={item.flag} id={index} />
                        </li>
                    ))}
                </ul>
                <hr/>
                </>
            ));
        }
    }, [flagSet, isFetched]);

    useEffect(() => {
        if (isQuestionPrepped && questionCountry) {
            setPreparedQuestion(() => (
                <>
                    <div className={styles.headerBar}>
                        <h2>Which Flag is: {questionCountry}'s?</h2>
                        <h2>Score: {score}/{questionsAsked}</h2>
                    </div>
                    <hr/>
                </>
            ));
        }
    }, [questionCountry, flagSet, isQuestionPrepped, score, questionsAsked]);

    useEffect(() => {
        if (isFetched) {
            pickCountry();
            setIsCountryPicked(true);
            console.log(flagSet);
        }
    }, [isFetched, flagSet]);

    useEffect(() => {
        let answerText;
        let answerStyling;
        let nextStep;
        if (isAnswered) {
            setQuestionsAsked(prev=>prev+1);
            console.log("isAnswered UseEffect triggered")
            if (answerIndex==questionIndex) {
                setScore(score + 1);
                answerText = "CORRECT!!!!!";
                answerStyling = styles.correct
            }
            else {
                answerText = `Sorry - you picked ${flagSet[answerIndex].country}'s!!!`
                answerStyling = styles.incorrect
            }
            if (questionsAsked >= 9) {
                nextStep = <button className={styles.button} onClick={handleResetGame}>Start Again?</button>
            }
            else {
                nextStep = <button className={styles.button} onClick={handleNextQuestion}>Next Question?</button>
            }
            setPreparedAnswer(() => {
                return (
                <>
                    <h2 className={answerStyling}>{answerText}</h2>
                    {nextStep}
                </>)
            })
        }
        
    }, [isAnswered])

    return (
        <div className="questions">
            {isQuestionPrepped ? preparedQuestion : noData}
            {isCountryPicked ? preparedData : noData}
            {isAnswered ? preparedAnswer : empty}
        </div>
    )
}

export default Questions;