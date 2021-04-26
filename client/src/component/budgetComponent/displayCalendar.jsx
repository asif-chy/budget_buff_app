import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { datesGenerator } from 'dates-generator';

//Disclosure: The component was developed based on the following code. Credit: Ibrahim
//https://dev.to/aibrahim3546/creating-a-custom-calendar-in-react-from-scratch-1hej

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function DisplayCalendar(props) {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [dateData, setDateData] = useState([]);

    const [calendar, setCalendar] = useState({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear()
    });

    const [userData, setUserData] = useState({
        userId: ""
    });

    //console.log(props.itemList.userId);
    useEffect(() => {

        const userId = props.itemList.userId;
        //console.log(userId);

        setUserData({
            userId: userId
        })

    }, [props.itemList.userId])

    useEffect(() => {

        console.log(userData);

        if (userData.userId !== "") {
            //Assign Current Month/Year to body
            const body = {
                month: calendar.month,
                year: calendar.year
            }

            //Pass body inside dateGenerator to grab all dates for the month
            const { dates, nextMonth, nextYear, previousMonth, previousYear } = datesGenerator(body);
            //console.log(dates);

            const dateList = setDateList(dates);
            //console.log(dateList);

            const userId = props.itemList.userId;
            //console.log(userId);

            fetchTotalList(dates, dateList, userId);

            //Pass functions nextMonth, nextYear, previousMonth, previousYear
            //fetched from dateGenerator inside calendar
            setCalendar({
                ...calendar,
                nextMonth,
                nextYear,
                previousMonth,
                previousYear
            });
        }
    }, [calendar.month, userData])

    const filterDates = (dates) => {

        // let newDates = dates.map((week) => {
        //     week.filter((each) => {
        //         console.log(each.month);
        //         return each.month === 3;//calendar.month;
        //     })
        // });

        let newDates = dates.map(week => week.filter(each => each.month === 3));

        //console.log(newDates); 

        return newDates;
    }

    const fetchTotalList = async (dates, dateList, userId) => {
        try {
            const res = await axios.get('http://localhost:9000/getTotalList', {
                params: {
                    userId: userId,
                    dateList: dateList
                }
            });

            if (null !== res.data.totalList && !res.data.error) {
                const totalList = res.data.totalList;

                updateDates(dates, dateList, totalList);

            }
        } catch (e) {
            console.log(e);
        }
    };

    const updateDates = (dates, dateList, totalList) => {

        var totalHashMap = new Map();

        //console.log(dateList);
        //console.log(totalList);
        var j = 0;
        var i = 0;
        var totalValue;
        var dateString;
        var dateIndex = 0;

        while (i < dateList.length) {

            if (j < totalList.length && dateList[i] === (totalList[j].listDate)) {
                totalHashMap.set(dateList[i], totalList[j].listTotal);
                j++;
                i++;
            } else {
                totalHashMap.set(dateList[i], '0');
                i++;
            }
        }

        dates.map((week) => {
            week.map((each) => {
                dateString = each.year + '-' + each.month + '-' + each.date;
                totalValue = parseInt(totalHashMap.get(dateString));
                Object.assign(each, { total: totalValue });
                Object.assign(each, { dateIndex: dateIndex });
                dateIndex++;
            })
        })
        //console.log(totalHashMap);
        //Pass dates fetched from dateGenerator inside calendarDateList
        setDateData([...dates]);
        props.onAddDateList(dates);
        //console.log(dates);
    }

    const setDateList = (dates) => {
        var dateList = [];

        dates.map((week) => {
            week.map((each) => {
                var dateString = each.year + '-' + each.month + '-' + each.date;
                dateList.push(dateString);
            })
        })

        return dateList;
    }

    function onClickNext() {
        const body = {
            month: calendar.nextMonth,
            year: calendar.nextYear
        };

        const { dates, nextMonth, nextYear, previousMonth, previousYear } = datesGenerator(body);

        const dateList = setDateList(dates);
        const userId = props.userId;
        fetchTotalList(dates, dateList, userId);

        setCalendar({
            ...calendar,
            month: calendar.nextMonth,
            year: calendar.nextYear,
            nextMonth,
            nextYear,
            previousMonth,
            previousYear
        });
    }

    function onClickPrevious() {
        const body = {
            month: calendar.previousMonth,
            year: calendar.previousYear
        };

        const { dates, nextMonth, nextYear, previousMonth, previousYear } = datesGenerator(body);

        const dateList = setDateList(dates);
        const userId = props.userId;
        fetchTotalList(dates, dateList, userId);

        setCalendar({
            ...calendar,
            month: calendar.previousMonth,
            year: calendar.previousYear,
            nextMonth,
            nextYear,
            previousMonth,
            previousYear
        });
    }

    function onSelectDate(date) {
        setSelectedDate(new Date(date.year, date.month, date.date))
    }

    return (
        <div className="budgetCalendarBox">
            <div className="budgetCalendarContainer">
                <div className="budgetCalendarPrevNext">
                    <div onClick={onClickPrevious} id="budgetCalendarPrev">
                        Prev
                    </div>
                    <div onClick={onClickNext} id="budgetCalendarNext">
                        Next
                    </div>
                </div>
                <div className="budgetCalendarMonth">
                    {months[calendar.month]}
                </div>
                <div>

                    <div>
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr>
                                    {days.map((day) => (
                                        <td key={day} className="budgetCalendarTableRowWeek">
                                            <div style={{ textAlign: 'center', padding: '5px 0' }}>
                                                {day}
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                {dateData.length > 0 && dateData.map((week, index) => (
                                    <tr key={index} className="tableRowDay">
                                        {week.map((each, subIndex) => (
                                            <td key={subIndex} className="budgetCalendarTableRowDay">
                                                <div onClick={() => onSelectDate(each)} id="calendarDateSet">
                                                    <Link id="displayDayLink"
                                                        to={{
                                                            pathname: "/budget",
                                                            each,
                                                            userData: [userData.userId]
                                                        }}
                                                    >{each.date}</Link>
                                                </div>
                                                <div id="calendarTotal">
                                                    T:{each.total}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style={{ padding: 10 }}>
                    Selected Date: {selectedDate.toDateString()}
                </div>
            </div>
        </div>
    );
}

export default DisplayCalendar;