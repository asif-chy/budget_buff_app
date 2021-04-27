import React from 'react';
import axios from 'axios';
import CreateItem from '../component/budgetComponent/createItem';
import DisplayItemList from '../component/budgetComponent/displayItemList';
import DisplayCalendar from '../component/budgetComponent/displayCalendar';
import DisplayBudgetGraph from '../component/budgetGraphComponent/displayBudgetGraph';
import { Link } from "react-router-dom";

function BudgetPage(props) {

    const [itemList, setItemList] = React.useState({
        userId: "",
        listDate: "",
        isSaved: "",
        listTotal: "",
        list: []
    });

    const [dateData, setDateData] = React.useState([]);

    console.log(props);

    React.useEffect(() => {
        if (props.location.userData === undefined) {
            console.log("Calling Replace");
            props.history.replace('/');
        } else {
            console.log("Setting Id");
            var id = props.location.userData[0];
        }
    })

    React.useEffect(() => {

        const fetchItemList = async () => {
            try {

                //console.log(props.location.userData[0]);
                //console.log(props.location.each);

                if (props.location.userData === undefined) {
                    console.log("Calling Replace");
                    props.history.replace('/');
                } else {
                    console.log("Setting Id");
                    var id = props.location.userData[0];
                }
                console.log(id);

                var currentDate = null;
                if (props.location.each === undefined) {
                    const date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth();
                    var day = date.getDate();
                    currentDate = year + '-' + month + '-' + day;
                } else {
                    console.log("Setting Date");
                    currentDate = props.location.each.year + '-' + props.location.each.month + '-' + props.location.each.date;
                }
                console.log(currentDate);


                setItemList(previousValue => {
                    return {
                        ...previousValue,
                        userId: id,
                        listDate: currentDate
                    }
                })
                const res = await axios.get('/getItemListData', {
                    params: {
                        userId: id,
                        listDate: currentDate
                    }
                });
                console.log(res);
                console.log(res.data.itemList);

                if (null !== res.data.itemList && !res.data.error) {

                    const fetchedItemList = res.data.itemList;
                    var saved = fetchedItemList.isSaved;
                    var budgetList = fetchedItemList.list;

                    console.log("LIST");
                    console.log(budgetList);

                    if (saved !== undefined && budgetList !== undefined) {
                        setItemList(previousValue => {
                            return {
                                ...previousValue,
                                isSaved: saved,
                                list: budgetList
                            }
                        })
                    }
                    //console.log(itemList)
                } else if (null === res.data.itemList && !res.data.error) {
                    console.log("NULL");
                    setItemList(previousValue => {
                        return {
                            ...previousValue,
                            isSaved: false,
                            list: []
                        }
                    })
                }
            } catch (e) {
                console.log(e);
            }
        };
        fetchItemList();
    }, [props.location.each]);

    React.useEffect(() => {

        const updateListTotal = () => {
            const initListTotal = findTotal(itemList);
            setItemList(previousValue => {
                return {
                    ...previousValue,
                    listTotal: initListTotal
                }
            })
        }

        updateListTotal();

    }, [itemList.list]);

    function findTotal(itemList) {
        var listTotal = 0;
        itemList.list.forEach((item) => {
            listTotal = parseInt((listTotal) + parseInt(item.amount));
        })
        return listTotal;
    }

    function updateItemList(item) {
        setItemList(previousValue => {
            return {
                ...previousValue,
                list: [...previousValue.list, item]
            };
        })
    }

    function deleteItem(id) {
        setItemList(prevValue => {
            return {
                ...prevValue,
                list: prevValue.list.filter((item) => {
                    return item.itemId !== id;
                })
            };
        });
    }

    async function handleBudgetSubmit(event) {
        event.preventDefault();
        console.log("Before Budget Save Call");
        console.log(itemList.isSaved);
        console.log(itemList);

        if (!itemList.isSaved) {
            //const res = await 
            axios.post('/saveItemListData', { itemList });

            setItemList(previousValue => {
                return {
                    ...previousValue,
                    isSaved: true,
                };
            })

        } else {
            console.log("update");
            axios.put('/updateItemListData', { itemList });
        }
    }

    function updateDateData(dateList) {
        setDateData([...dateList]);
    }

    return (
        <div className="budgetPage">
            <div className="budgetListBox">
                <div className="budgetListContainer">
                    <h1 id="budgetListTitle">BUDGET LIST</h1>
                    <div className="budgetListHeaderOne">
                        <h3 id="budgetListDate">DATE: {itemList.listDate}</h3>
                        <Link id="budgetListHomeLink" to="/">HOME</Link>
                    </div>
                    <div className="budgetListHeaderTwo">
                        <h3 id="budgetListItem">ITEM</h3>
                        <h3 id="budgetListPrice">PRICE</h3>
                    </div>
                    <form onSubmit={handleBudgetSubmit} className="budgetListForm">
                        <CreateItem
                            list={itemList.list}
                            onAdd={updateItemList}
                        />
                        <ol className="budgetOrderedList">
                            {itemList.list.map((item, index) =>
                            (<DisplayItemList key={index}
                                item={item}
                                deleteItem={deleteItem}
                            />))}
                        </ol>

                        <div className="budgetListHeaderThree">
                            <h3 id="budgetListTotal">TOTAL: ${itemList.listTotal}</h3>
                            <button type="submit" id="budgetListSaveList"><i class="fa fa-save fa-2x"></i></button>
                        </div>

                    </form>
                </div>
            </div>
            <DisplayCalendar
                itemList={itemList}
                onAddDateList={updateDateData}
            />
            <DisplayBudgetGraph
                dateList={dateData}
            />

        </div>
    )
}

export default BudgetPage;