import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaHome } from 'react-icons/fa';
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


    useEffect(() => {


        
        setTop10([
            { rank: 1, name: '엔비디아', change: '+1.1%', price: '195,096원', color: 'red', image: '/E.png' },
            { rank: 2, name: 'SK하이닉스', change: '+1.1%', price: '198,200원', color: 'red', image: '/SK.png' },
            { rank: 3, name: '삼성전자', change: '-4.2%', price: '56,600원', color: 'blue', image: '/SA.png' },
            { rank: 4, name: 'NAVER', change: '-0.2%', price: '172,100원', color: 'gray', image: '/N.png' },
            { rank: 5, name: '카카오', change: '-0.6%', price: '37,450원', color: 'gray', image: '/K.png' },
            { rank: 6, name: 'CJ씨푸드', change: '-2.0%', price: '3,090원', color: 'blue', image: '/C.png' },
        ]);


        setAllData([
            { rank: 1, name: '엔비디아', change: '+1.1%', price: '195,096원', color: 'red', image: '/E.png' },
            { rank: 2, name: 'SK하이닉스', change: '+1.1%', price: '198,200원', color: 'red', image: '/SK.png' },
            { rank: 3, name: '삼성전자', change: '-4.2%', price: '56,600원', color: 'blue', image: '/SA.png' },
            { rank: 4, name: 'NAVER', change: '-0.2%', price: '172,100원', color: 'gray', image: '/N.png' },
            { rank: 5, name: '카카오', change: '-0.6%', price: '37,450원', color: 'gray', image: '/K.png' },
            { rank: 6, name: 'CJ씨푸드', change: '-2.0%', price: '3,090원', color: 'blue', image: '/C.png' },
        ]);


    


    }, []);

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
        const foundData = allData.filter((data) => data.name.toLowerCase().includes(searchText.toLowerCase()));
        setSearchData(foundData);
        setSellPercentage(0);
        setBuyPercentage(0);
    };

    const handleStockDetail = (stock) => {
        setContentData(stock);
        setExContentData({name: '엔비디아', englishName:'NVIDIA', change: '+1.1%', price: '195,096원', Dollar: '121.78', color: 'red', image: '/E.png'
            , intentionSell: '834,245', intentionBuy : '892,543', Recommendation : true, RecommendationReason:'~~~~~~',
            PBR: '...', PER: '...' 
        })
        setPageState('Stock');
        const totalIntention = exContentData.intentionSell + exContentData.intentionBuy;
        const sellPercentage = (exContentData.intentionSell / totalIntention) * 100;
        const buyPercentage = (exContentData.intentionBuy / totalIntention) * 100;
        setSellPercentage(sellPercentage);
        setBuyPercentage(buyPercentage);
        console.log("퍼센티지 : " + sellPercentage , buyPercentage)
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
                            <h2>오늘의 추천 주식 2222</h2>
                            <div className="stock-list">
                                {top10.map(stock => (
                                    <div key={stock.rank} className="stock-item" onClick={() => handleStockDetail(stock)}>
                                        <span className="rank">{stock.rank}</span>
                                        <img src={stock.image} alt={stock.name} className="stock-image" />
                                        <span className="name">{stock.name}</span>
                                        <span className="price-change">
                                            <span className="change" style={{ color: stock.color }}>{stock.change}</span>
                                            <span className="price">{stock.price}</span>
                                        </span>
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
                                        <div key={stock.rank} className="stock-item" onClick={() => handleStockDetail(stock)}>
                                            <img src={stock.image} alt={stock.name} className="stock-image" />
                                            <span className="name">{stock.name}</span>
                                            <span className="price-change">
                                                <span className="change" style={{ color: stock.color }}>{stock.change}</span>
                                                <span className="price">{stock.price}</span>
                                            </span>
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
                                    <img src={exContentData.image} alt={exContentData.name} className="stock-image2" />
                                    <div className='stock-name'>{exContentData.name}</div>
                                    <div className='stock-enName'>{exContentData.englishName}</div>
                                </div>
                                
                                <div className='stock-pice'>
                                    <div className='Kr'>{exContentData.price}</div>
                                    <div className='En'>${exContentData.Dollar}</div>

                                    <div className='unit-button-box'>
                                        <button className='unit-button1'>$</button><button className='unit-button2'>원</button>
                                    </div>
                                    
                                </div>
                                <div className='stock-change'>
                                    <div style={{ color: exContentData.change>0? 'red':'blue' }}>{exContentData.change}</div>
                                </div>
                                <div className='stock-intention'>이 주식에 대한 사람들 의견</div>
                                    <div className="intention-bar">
                                    <div
                                        className="sell-bar"
                                        style={{ width: `${sellPercentage}%` }}
                                    >
                                        SELL<br />{exContentData.intentionSell.toLocaleString()}
                                    </div>
                                    <div className="vs-bar"> <img src={'/VS.png'} className='vs'/></div>
                                    <div
                                        className="buy-bar"
                                        style={{ width: `${buyPercentage}%` }}
                                    >
                                        BUY<br />{exContentData.intentionBuy.toLocaleString()}
                                    </div>
                                </div>
                            
                                <div className='recommend-per'>주식 추천 정도 </div>
                                <div className='recommend-per-content'>
                                    <img src='/Yes.png' className='recommend-img'/>
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
