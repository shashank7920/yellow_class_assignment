import React , {useState , useEffect} from 'react';
import './Main.css';

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  padding: '50px',
  zIndex: 1000
}


function Main() {

    const[value , setValue] = useState("");
    const[results , setResults] = useState([]);
    const[selectedImg , setSelectedImg] = useState(null);
    const[first , setFirst] = useState(false);
    const[imgIndex , setImgIndex] = useState(-1);
    const[imgId , setImgId] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [pages, setPages] = useState(1);



    function change_target(url, data) {
        return new Promise((res , rej) => {
            if(imgIndex===-1){
                rej(0);
            }
            else{
                var i = imgIndex;
                setImgIndex(i-1);
                console.log(imgIndex + "heres");
                res(i);
            }
        })            
  };


  function change_target_2(url, data) {
        return new Promise((res , rej) => {
            if(imgIndex===results.length){
                rej(0);
            }
            else{
                var i = imgIndex;
                setImgIndex(i+1);
                console.log(imgIndex + "heres");
                res(i);
            }
        })            
  };


    const fetchImages = () => {
        fetch(`https://api.unsplash.com/search/photos/?client_id=llm_s3LPu_dBt7IpsvbJWkIp0u9L68y-Pmu5auWR14g&query=${value}&orientation=squarish&page=1&per_page=30`)
        .then(res=>res.json())
        .then(data=>{
            console.log(data);
            console.log(data.total_pages);
            setResults(data.results);
            setPages(data.total_pages);
        })
    }


    useEffect(() => {
        var i;
        for (i = 2; i <= pages; i++) {
            

            fetch(`https://api.unsplash.com/search/photos/?client_id=llm_s3LPu_dBt7IpsvbJWkIp0u9L68y-Pmu5auWR14g&query=${value}&orientation=squarish&page=${i}&per_page=30`)
                .then(res=>res.json())
                .then(data=>{
                    console.log(data);
                    console.log(data.results.length);
                    console.log(data.results[0]);
                    results.push(data.results[0]);
                    var j;
                    for( j=0 ; i<data.results.length ; j++){
                        console.log(data.results[j]);
                    }


                })



        }
    } , [pages]);


    useEffect(() => {
        var i;
        for (i = 0; i < results.length; i++) {
            if(results[i].id===imgId){
                setImgIndex(i);
            }
        }
    } , [first]);



    return (
        <div className = "main">
            <div className = "mydiv navbar-light bg-light">
           <span style={{fontSize:"150%" , fontFamily:'sans-serif'}}> <b>Search </b></span>
            <input class="form-control mr-sm-2"  style={{width:"60%"}} type="text" value={value}  placeholder="Search an Item"  onChange={(e) => setValue(e.target.value)} />
            <button type="button" class="btn btn-primary searchBtn" onClick={fetchImages}  >Go!!</button>

            </div>
            <div className="gallary">
                {
                    results.map((item) => {
                        return <img className="item" key={item.id} alt="" src={item.urls.regular}  onClick={(e) => {
                            setSelectedImg(item.urls.regular);
                            setImgId(item.id);
                            setIsOpen(true);
                            setFirst(!first);
                            
                            
                            console.log(item.id);
                            console.log(results);
                            console.log(imgId);

                             }} />  
                    })
                }
            </div>

            {isOpen ? (
            <div style={MODAL_STYLES} className="main-modal" >
                
                <div className="modal-img">
                <button type="button" className="btn btn-success navBtn"  onClick={(e) => {

                var q = change_target().then((message) => {
                    console.log(message + "hello res of promise");
                    setSelectedImg(results[message].urls.regular);
                })
                .catch((err) =>{
                    console.log(err);
                })

                }}   >  Left</button>

            
                <img className = "modal-image" src={selectedImg} alt="" />

                <button type="button" className="btn btn-success navBtn"
                onClick={(e) => {
                var q = change_target_2().then((message) => {
                    console.log(message + "hello res of promise");
                    setSelectedImg(results[message].urls.regular);
                })
                .catch((err) =>{
                    console.log(err);
                })
                }} 
                >Right</button>
                </div>

                <div>
                <button type="button" class="btn btn-danger clsViewer" onClick={() => setIsOpen(false)}>Close Viewer</button>
                </div>

            </div>
            ) : <div></div>}

        </div>
    )
}

export default Main;
