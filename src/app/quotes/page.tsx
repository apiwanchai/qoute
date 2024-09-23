"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, Row, Col, Button, Typography, message, Input, Select, Skeleton } from "antd";
import axios from "axios";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const { Search } = Input;
const { Option } = Select;

interface Quote {
  id: number;
  text: string;
  votes: number;
}

const LazyChart = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Pie),
  { ssr: false }
);

const QuotesPage = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]); 
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [sortOrder, setSortOrder] = useState<string>("none");

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/quotes");
        setQuotes(data);
        setFilteredQuotes(data); 
        setTimeout(async () => {
          setLoading(false);
          setChartLoading(false);
        }, 3000);
      } catch (error) {
        console.error("Error fetching quotes:", error);
        setLoading(false);
        setChartLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  const handleVote = async (id: number) => {
    try {
      await axios.post("/api/quotes", { id });
      const updatedQuotes = quotes.map((quote) =>
        quote.id === id ? { ...quote, votes: quote.votes + 1 } : quote
      );
      setQuotes(updatedQuotes);
      applyFilters(updatedQuotes); 
      message.success(`Voted for Quote ${id}`);
    } catch (error) {
      console.error("Error voting:", error);
      message.error("Failed to vote");
    }
  };

 
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(quotes, value, sortOrder); 
  };


  const handleSort = (value: string) => {
    setSortOrder(value);
    applyFilters(quotes, searchTerm, value);
  };

  
  const applyFilters = (data: Quote[], search: string = searchTerm, sort: string = sortOrder) => {
    let filtered = data;


    if (search) {
      filtered = filtered.filter((quote) =>
        quote.text.toLowerCase().includes(search.toLowerCase())
      );
    }


    if (sort === "asc") {
      filtered = filtered.sort((a, b) => a.votes - b.votes);
    } else if (sort === "desc") {
      filtered = filtered.sort((a, b) => b.votes - a.votes);
    }

    setFilteredQuotes(filtered);
  };

  const chartData = {
    labels: filteredQuotes.map((quote) => `Quote ${quote.id}`),
    datasets: [
      {
        label: "# of Votes",
        data: filteredQuotes.map((quote) => quote.votes),
        backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56", "#4bc0c0"],
        hoverBackgroundColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56", "#4bc0c0"],
      },
    ],
  };

  return (
    <div>
      <Typography.Title level={2}>Quotes List</Typography.Title>


      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between" }}>
   
        <Search
          placeholder="Search quotes"
          allowClear
          enterButton="Search"
          onSearch={handleSearch}
          style={{ width: "300px" }}
        />

   
        <Select
          defaultValue="none"
          style={{ width: 150 }}
          onChange={handleSort}
        >
          <Option value="none">No Sort</Option>
          <Option value="asc">Sort by Votes (Asc)</Option>
          <Option value="desc">Sort by Votes (Desc)</Option>
        </Select>
      </div>


      <Row gutter={[16, 16]}>
        {loading ? (
     
          Array.from({ length: 5 }, (_, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card loading={true} />
            </Col>
          ))
        ) : (
        
          filteredQuotes.map((quote) => (
            <Col xs={24} sm={12} md={8} lg={6} key={quote.id}>
              <Card
               style={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
              >
                <Card.Meta
                  title={quote.text}
                  description={
                    <>
                      <p>Votes: {quote.votes}</p>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" onClick={() => handleVote(quote.id)}>
                          Vote
                        </Button>
                      </div>
                    </>
                  }
                />
              </Card>
            </Col>
          ))
        )}
      </Row>

      <div style={{ marginTop: "2rem", width: "300px", height: "300px", margin: "0 auto" }}>
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          Vote Distribution
        </Typography.Title>
        {chartLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <LazyChart data={chartData} />
        )}
      </div>
    
    </div>
  );
};

export default QuotesPage;
