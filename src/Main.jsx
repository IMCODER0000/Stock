import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaHome } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import './css/Main.css';

function Main() {
    const [searchText, setSearchText] = useState('');
    const [top10, setTop10] = useState([]);
    const [allData, setAllData] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [contentData, setContentData] = useState({});
    const [exContentData, setExContentData] = useState({});
    const [pageState, setPageState] = useState('Main');
    const [sellPercentage, setSellPercentage] = useState(0);
    const [buyPercentage, setBuyPercentage] = useState(0);
    const [recommend, setRecommned] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        getTop10();
        setAllData([
            { rank: 1, name: '엔비디아', change: '+1.1%', price: '195,096원', color: 'red', image: '/E.png' },
            { rank: 2, name: 'SK하이닉스', change: '+1.1%', price: '198,200원', color: 'red', image: '/SK.png' },
            { rank: 3, name: '삼성전자', change: '-4.2%', price: '56,600원', color: 'blue', image: '/SA.png' },
            { rank: 4, name: 'NAVER', change: '-0.2%', price: '172,100원', color: 'gray', image: '/N.png' },
            { rank: 5, name: '카카오', change: '-0.6%', price: '37,450원', color: 'gray', image: '/K.png' },
            { rank: 6, name: 'CJ씨푸드', change: '-2.0%', price: '3,090원', color: 'blue', image: '/C.png' },
        ]);
        const totalIntention = exContentData.downVotes + exContentData.upVotes;
        const sellPercentage = (exContentData.downVotes / totalIntention) * 100;
        const buyPercentage = (exContentData.upVotes / totalIntention) * 100;
        setSellPercentage(sellPercentage);
        setBuyPercentage(buyPercentage);
        console.log("퍼센티지 : " + sellPercentage, buyPercentage)
    }, []);

    useEffect(() => {
        if (exContentData.downVotes === 0 && exContentData.upVotes === 0) {
            setSellPercentage(50);
            setBuyPercentage(50);
        }
        else {
            const totalIntention = exContentData.downVotes + exContentData.upVotes;
            const sellPercentage = (exContentData.downVotes / totalIntention) * 100;
            const buyPercentage = (exContentData.upVotes / totalIntention) * 100;
            setSellPercentage(sellPercentage);
            setBuyPercentage(buyPercentage);
        }
        console.log("퍼센티지 : " + sellPercentage, buyPercentage)
        setRecommned(false);
    }, [exContentData, recommend]);

    useEffect(() => {
        if (initialLoad && exContentData.downVotes !== undefined && exContentData.upVotes !== undefined) {
            const totalVotes = exContentData.downVotes + exContentData.upVotes;
            if (totalVotes === 0) {
                setSellPercentage(50);
                setBuyPercentage(50);
            } else {
                const sellPct = (exContentData.downVotes / totalVotes) * 100;
                const buyPct = (exContentData.upVotes / totalVotes) * 100;
                setSellPercentage(sellPct);
                setBuyPercentage(buyPct);
            }
            setInitialLoad(false);
        }
    }, [exContentData, initialLoad]);

    const getTop10 = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/stocks/top10", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            const processedData = data.result.map(stock => {
                const isNegative = stock.changePercentage.trim().startsWith("-");
                const recommendPercentage = (stock.recommendScore * 100).toFixed(1) + "%";
                return {
                    ...stock,
                    color: isNegative ? "red" : "blue",
                    recommendPercentage: recommendPercentage,
                };
            });
            console.log(processedData);
            setTop10(processedData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    const getSearchData = async (searchText) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/stocks/search/${searchText}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            const data = await response.json();
            if (!data?.result) {
                console.error("Invalid data format: result is missing", data);
                return;
            }
            if (Array.isArray(data.result)) {
                const processedData = data.result.map(stock => {
                    const isNegative = stock.changePercentage.trim().startsWith("-");
                    const cleanChangePercentage = stock.changePercentage.trim();
                    const recommendScore = parseFloat(stock.recommendationScore);
                    const recommendPercentage = !isNaN(recommendScore) && recommendScore !== 0
                        ? (recommendScore * 100).toFixed(1) + "%"
                        : "0.0%";
                    return {
                        ...stock,
                        color: isNegative ? "red" : "blue",
                        changePercentage: cleanChangePercentage,
                        recommendPercentage: recommendPercentage,
                    };
                });
                console.log(processedData);
                setSearchData(processedData);
            } else {
                const stock = data.result;
                const isNegative = stock.changePercentage.trim().startsWith("-");
                const cleanChangePercentage = stock.changePercentage.trim();
                const recommendScore = parseFloat(stock.recommendationScore);
                const recommendPercentage = !isNaN(recommendScore) && recommendScore !== 0
                    ? (recommendScore * 100).toFixed(1) + "%"
                    : "0.0%";
                const processedData = [{
                    ...stock,
                    color: isNegative ? "red" : "blue",
                    changePercentage: cleanChangePercentage,
                    recommendPercentage: recommendPercentage,
                }];
                console.log(processedData);
                setSearchData(processedData);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error.message || error);
        }
    };

    const getSearchData2 = async (stock) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/stocks/search/${stock.name}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            const data = await response.json();
            if (!data?.result) {
                console.error("Invalid data format: result is missing", data);
                return;
            }
            const stockData = data.result;
            const isNegative = stockData.changePercentage.trim().startsWith("-");
            const cleanChangePercentage = stockData.changePercentage.trim();
            const recommendScore = parseFloat(stockData.recommendationScore);
            const recommendPercentage = !isNaN(recommendScore) && recommendScore !== 0
                ? (recommendScore * 100).toFixed(1) + "%"
                : "0.0%";
            const processedData = {
                ...stockData,
                color: isNegative ? "red" : "blue",
                changePercentage: cleanChangePercentage,
                recommendPercentage: recommendPercentage,
            };
            console.log("@@@@@@ : ", processedData);
            setExContentData(processedData);
        } catch (error) {
            console.error("Failed to fetch data:", error.message || error);
        }
    };

    const handleChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleHomeClick = () => {
        setPageState('Main');
        setSearchText('');
        setSellPercentage(0);
        setBuyPercentage(0);
    };

    const handleSearch = () => {
        setPageState('Search');
        getSearchData(searchText);
        setSellPercentage(0);
        setBuyPercentage(0);
    };

    const handleStockDetail = (stock) => {
        console.log("상세보기 : ", stock);
        setPageState('Stock');
        setExContentData(stock);

        // 초기 퍼센티지 계산 및 설정
        const totalVotes = stock.upVotes + stock.downVotes;
        if (totalVotes === 0) {
            setSellPercentage(50);
            setBuyPercentage(50);
        } else {
            const sellPct = (stock.downVotes / totalVotes) * 100;
            const buyPct = (stock.upVotes / totalVotes) * 100;
            setSellPercentage(sellPct);
            setBuyPercentage(buyPct);
        }

        getSearchData2(stock);
    };

    const handleStockDetail2 = (stock) => {
        console.log("상세보기 : ", stock);
        setPageState('Stock');
        setExContentData(stock);

        // 초기 퍼센티지 계산 및 설정
        const totalVotes = stock.upVotes + stock.downVotes;
        if (totalVotes === 0) {
            setSellPercentage(50);
            setBuyPercentage(50);
        } else {
            const sellPct = (stock.downVotes / totalVotes) * 100;
            const buyPct = (stock.upVotes / totalVotes) * 100;
            setSellPercentage(sellPct);
            setBuyPercentage(buyPct);
        }
    };

    useEffect(() => {
        if (exContentData.intentionSell && exContentData.intentionBuy) {
            const sellIntention = Number(exContentData.intentionSell.replace(/,/g, ''));
            const buyIntention = Number(exContentData.intentionBuy.replace(/,/g, ''));
            const totalIntention = sellIntention + buyIntention;
            if (totalIntention > 0) {
                const sellPct = (sellIntention / totalIntention) * 100;
                const buyPct = (buyIntention / totalIntention) * 100;
                setSellPercentage(sellPct);
                setBuyPercentage(buyPct);
            }
        }
    }, [exContentData]);

    const Sell = async (Id) => {
        try {
            const result = await Swal.fire({
                title: '비추천 하시겠습니까?',
                icon: 'question',
                confirmButtonText: '확인',
                cancelButtonText: '취소',
                showCancelButton: true,
            });

            if (result.isConfirmed) {
                // 즉시 UI 업데이트
                const newDownVotes = exContentData.downVotes + 1;
                const totalVotes = newDownVotes + exContentData.upVotes;
                const sellPct = (newDownVotes / totalVotes) * 100;
                const buyPct = (exContentData.upVotes / totalVotes) * 100;

                setExContentData(prev => ({
                    ...prev,
                    downVotes: newDownVotes
                }));
                setSellPercentage(sellPct);
                setBuyPercentage(buyPct);

                // API 호출
                const res = await axios.post(`http://localhost:8080/api/v1/stocks/${Id}/vote`,
                    null,
                    {
                        params: { isRecommend: false }
                    }
                );

                await getSearchData2({ name: exContentData.name });
                console.log("응답:", res.data);
                setRecommned(true);
            }
        } catch (err) {
            console.error("에러 발생:", err);
        }
    };

    const Buy = async (Id) => {
        try {
            const result = await Swal.fire({
                title: '추천 하시겠습니까?',
                icon: 'question',
                confirmButtonText: '확인',
                cancelButtonText: '취소',
                showCancelButton: true,
            });

            if (result.isConfirmed) {
                // 즉시 UI 업데이트
                const newUpVotes = exContentData.upVotes + 1;
                const totalVotes = newUpVotes + exContentData.downVotes;
                const buyPct = (newUpVotes / totalVotes) * 100;
                const sellPct = (exContentData.downVotes / totalVotes) * 100;

                setExContentData(prev => ({
                    ...prev,
                    upVotes: newUpVotes
                }));
                setBuyPercentage(buyPct);
                setSellPercentage(sellPct);

                // API 호출
                const res = await axios.post(
                    `http://localhost:8080/api/v1/stocks/${Id}/vote`,
                    null,
                    {
                        params: { isRecommend: true }
                    }
                );

                await getSearchData2({ name: exContentData.name });
                console.log("응답:", res.data);
                setRecommned(true);
            }
        } catch (err) {
            console.error("에러 발생:", err);
        }
    };

    return (
        <div>
            <div className="Main-total">
                <div className="Main-Content">
                    <div className="Main-Search">
                        <button className="home-button" onClick={handleHomeClick}>
                            <FaHome />
                        </button>
                        <input
                            type="text"
                            className="search-input"
                            value={searchText}
                            onChange={handleChange}
                            placeholder="검색어를 입력하세요..."
                        />
                        <button className="search-button" onClick={handleSearch}>
                            <FaSearch />
                        </button>
                    </div>

                    {pageState === 'Main' && (
                        <div>
                            <h2>오늘의 추천 주식</h2>
                            <div className="stock-list">
                                {top10.map((stock, index) => (
                                    <div key={stock.rank} className="stock-item" onClick={() => handleStockDetail(stock)}>
                                        <span className="rank">{index + 1}</span>
                                        <span className="name">{stock.name}</span>
                                        <span className="price-change">
                                            <span className="change" style={{ color: stock.color }}>{stock.changePercentage}</span>
                                            <span className="price">{stock.currentPrice}원</span>
                                        </span>
                                        <span className='reco'><span><img src='/Yes.png' className='recommend-img2'/>&nbsp;&nbsp;&nbsp;</span>{stock.recommendPercentage}</span>
                                        <span className='ticker'>{stock.ticker}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {pageState === 'Search' && (
                        <div>
                            <h2>검색 결과</h2>
                            <div className="stock-list">
                                {searchData.length > 0 ? (
                                    searchData.map(stock => (
                                        <div key={stock.rank} className="stock-item" onClick={() => handleStockDetail2(stock)}>
                                            <span className="rank">  </span>
                                            <span className="name">{stock.name}</span>
                                            <span className="price-change">
                                                <span className="change" style={{ color: stock.color }}>{stock.changePercentage}</span>
                                                <span className="price">{stock.currentPrice}</span>
                                            </span>
                                            <span className='reco'><span><img src='/Yes.png' className='recommend-img2'/>&nbsp;&nbsp;&nbsp;</span>{stock.recommendPercentage}</span>
                                            <span className='ticker'>{stock.ticker}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div>검색 결과가 없습니다.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {pageState === 'Stock' && (
                        <div>
                            <div className="stock-detail">
                                <div className='stock-name-box'>
                                    <div className='stock-name'>{exContentData.name}</div>
                                    <div className='stock-ticker'>{exContentData.ticker}</div>
                                </div>

                                <div className='stock-pice'>
                                    <div className='Kr'>{exContentData.currentPrice}원</div>
                                    <div className='stock-change'>
                                        <div className='previousClose'>{exContentData.previousClose}원</div>
                                        <div style={{ color: exContentData.change > 0 ? 'red' : 'blue' }}>{exContentData.changePercentage}</div>
                                    </div>
                                    <div className='unit-button-box'>
                                        <button className='unit-button1'>$</button><button className='unit-button2'>원</button>
                                    </div>

                                </div>

                                <div className='stock-intention'>이 주식에 대한 사람들 의견</div>
                                {!initialLoad && (
                                    <div className="intention-bar">
                                        <div
                                            className="sell-bar"
                                            style={{ width: `${Math.max(20, Math.min(80, sellPercentage))}%` }}
                                            onClick={() => Sell(exContentData.id)}
                                        >
                                            SELL<br />{exContentData.downVotes}
                                        </div>
                                        <div className="vs-bar"> <img src={'/VS.png'} className='vs' /></div>
                                        <div
                                            className="buy-bar"
                                            style={{ width: `${Math.max(20, Math.min(80, buyPercentage))}%` }}
                                            onClick={() => Buy(exContentData.id)}
                                        >
                                            BUY<br />{exContentData.upVotes}
                                        </div>
                                    </div>
                                )}
                                {initialLoad && (
                                    <div className="intention-bar">
                                        <div
                                            className="sell-bar"
                                            style={{ width: `50%` }}
                                        >
                                            SELL<br />{exContentData.downVotes}
                                        </div>
                                        <div className="vs-bar"> <img src={'/VS.png'} className='vs' /></div>
                                        <div
                                            className="buy-bar"
                                            style={{ width: `50%` }}
                                        >
                                            BUY<br />{exContentData.upVotes}
                                        </div>
                                    </div>
                                )}
                                <div className='recommend-per'>주식 추천 정도 </div>
                                <div className='recommend-per-content'>
                                    <img src='/Yes.png' className='recommend-img' />
                                    <div className='recommend-percent'>{exContentData.recommendPercentage}</div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Main;
