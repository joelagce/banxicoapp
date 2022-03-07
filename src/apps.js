import { useCallback, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import axios from 'axios';


import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	BarElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import './App.css';
import dayjs from "dayjs";



ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend
);
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const API_URL = (series) => `https://5i8qcjp333.execute-api.us-east-1.amazonaws.com/dev/series/${series}`

function App() {
	const [token, setToken] = useState("");
	const [show, setShow] = useState(true);
	const [seriesToFecth, setSeriesToFetch] = useState("");
	const [series, setSeries] = useState({});

	const seriesFromResult = (banxicoResult) => {
		try {
			let series = banxicoResult["bmx"]["series"];
			return series;
		} catch {
			return []
		}
	};
	let ref = useRef(null);

	const DowloadImage = useCallback(() => {
     const link = document.createElement('a');
	 link.download = 'grapich.png';
	 link.href = ref.current.toBase64Image();
	 link.click();
	},[]);

	const parseToChartJSFormat = (dataset) => {
		let parsed = {};
		parsed.labels = dataset.map((d) => d.fecha);
		parsed.datasets = [
			{
				data: dataset.map((d) => Number(d.dato)),
				borderColor: "rgba(255,0,0,1)",
				backgroundColor: "rgb(0, 0, 0)",
				pointRadius: 0
			},
		];
		return parsed;
	};
	const barseToChartJSFormat = (dataset) => {
		let parsed = {};
		parsed.labels = dataset.map((d) => d.fecha);
		parsed.datasets = [
			{
				data: dataset.map((d) => Number(d.dato)),
				backgroundColor: 'rgba(255,0,0,1)',
				borderColor: 'rgba(255,0,0,1)',
			   
				
				pointRadius: 0,
				borderWidth: 0.01
				
			},
		];
		return parsed;
	  };
	

	const handleSeriesToFetchChange = (event) => {
		setSeriesToFetch(event.target.value)
	}

	const handleSeriesToFetchEnter = async (event) => {
		if (event.key === 'Enter') {
			await fetchSeries()
		}
	}

	const fetchSeries = async () => {
		const API_URL_SERIES = API_URL(seriesToFecth)
		const result = await axios({
			method: 'GET',
			url: API_URL_SERIES,
			params: {token: token},
			headers: {
				'Authorization': '01f04831044f073702d9244604d41c055e7c14bb96218e169926482fb5699788',
				Accept: 'application/json'
			}
		})
		if (result.status === 200) {
			setSeries(result.data)
		}
	}
	

	return (
		<Container fluid className="mainContainer">
			
			<div className="container">
			
			<Row >
				<Col className="justify-content-md-center" >
					<h1 className="centerText">BANXICO API VISUALIZER</h1>
				</Col>
			</Row>
			<div className="login">
			<Row>
				<Col>
				
					<div className="title">Token</div>
					<input
						placeholder="Ingresa el token"
						type="text"
						id="token"
						
						aria-describedby="tokenhelp"
						onChange={(event) => {
							setToken(event.target.value)
						}}
						value={token}
					/>
				<div>
					
					</div>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className="title">Series</div>
					<InputGroup className="mb-3">
						<input
							placeholder="Ingresa la serie"
							type="text"
							id="series"
							aria-describedby="serieshelp"
							value={seriesToFecth}
							onChange={handleSeriesToFetchChange}
							onKeyDown={handleSeriesToFetchEnter}
						/>
					
						
					</InputGroup>
					<div  className="seriesid">
						Example: SF61745,SP68257
					</div>
				</Col>
			</Row>
			<Button className="button" variant="outline-secondary" id="button-addon2"  onClick={fetchSeries}>
							Fetch
						</Button>
			</div>
			</div>
        <div className="grapich">
		<>
      
   <div className="image">
      {show ? (

       <Row className="text-centr"  style={{ marginTop: 40 }}>
	   
	   {seriesFromResult(series).map((s) => (
	   
		   
		   <Col sm={12} md={6} lg={4} key={s.idSerie}>
			   
			   <Card className="text-center" >
				   <Card.Header>{`${s.idSerie} - ${s.titulo}`}</Card.Header>
				   <Card.Body>
					   
					   <Line ref={ref}
					   className="chart"
						   options={{
							   responsive: true,
							   plugins: { legend: { display: false } },
						   }}
						   data={parseToChartJSFormat(s.datos)}
					   />
				   
		   
				   </Card.Body>
			   </Card>
		   </Col>
	   ))}
   </Row>
      ) : (
		<Row className="text-centr"  style={{ marginTop: 40 }}>
		{seriesFromResult(series).map((s) => (
		
			
			<Col sm={12} md={6} lg={4} key={s.idSerie}>
				
				<Card className="text-center" >
					<Card.Header>{`${s.idSerie} - ${s.titulo}`}</Card.Header>
					<Card.Body>
						
						
						<Bar ref={ref}
						className="chart"

	data={barseToChartJSFormat(s.datos)}
	height={400}
	options={{
		responsive: true,
		plugins: { legend: { display: false } },
	}}
/>
					</Card.Body>
				</Card>
			</Col>
		))}
	</Row>
      )}
	  </div>
	  
	  <button
        type="button"
        onClick={() => {
          setShow(!show);
        }}
      >
        Mostrar {show ? 'Line' : 'Bar'}
      </button>
	  <button onClick={DowloadImage}>
		  dowload
	  </button>
    </>
		
		</div>
		
		
	

		</Container>
	);

}

export default App;
