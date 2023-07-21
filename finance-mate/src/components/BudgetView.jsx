import axios from "axios";
import {useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "./side-bar";
import LineChart from "./LineChart";
import { Link } from "react-router-dom";
import {
  Grid,
  Typography,
  Divider,
  Chip,
  IconButton,
  Card,
  CardContent,
  Tooltip,
  Skeleton,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";
import PageHeader from "./PageHeader";
import BudgetViewBanner from "./BudgetViewBanner";
import { getBudgetsThunk } from "../redux/budget/budget.action";
import { getExpensesThunk } from "../redux/expenses/expense.action";

import React from "react";
import styled from "styled-components";
const BudgetView = () => {
  const dispatch = useDispatch();
  // const [expenseName, setExpenseName] = useState("");
  // const [expenseAmount, setExpenseAmount] = useState("");
  const budgets = useSelector((state) => state.budget);
  const [selectedBudgetId, setSelectedBudgetId] = useState(undefined);
  const [selectedBudget, setSelectedBudget] = useState(undefined);
  const [budgetExpenses, setBudgetExpenses] = useState(undefined);
  const [lineChartData, setLineChartData] = useState(undefined);

  useEffect(() => {
    dispatch(getBudgetsThunk());
  }, []);
const BBox = styled.div`
  display: flex;
  justify-content: flex-start;  // change this to adjust horizontal distribution of items
  
  useEffect(() => {
    if (budgets.length > 0) {
      setSelectedBudgetId(budgets[0].id);
      setSelectedBudget(budgets[0]);
    }
  }, [budgets]);
  border: 3px solid lightgreen;
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  max-width: 400px;  // add this to limit how wide the component can get
`;

  useEffect(() => {
    const budget = budgets.find((budget) => budget.id === selectedBudgetId);
    if (budget) {
      setSelectedBudget(budget);
      setBudgetExpenses(budget.Expenses);
      setLineChartData(getLineGraphData(budget));
    }
  }, [selectedBudgetId]);
const BudgetInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

  const getLineGraphData = (budget) => {
    if (Array.isArray(budget.Expenses) && budget.Expenses.length > 0) {
      let budgetRemainingAmount = budget.amount;
      const lineData = [
        {
          id: "Budget: " + budget.budget_name,
          color: "hsl(151, 67%, 73%)",
          data: [
            { x: "Initial Budget: " + budget.budget_name, y: budget.amount },
            ...budget.Expenses.map((expense) => {
              budgetRemainingAmount -= expense.expense_value;
              return { x: expense.expense_name, y: budgetRemainingAmount };
            }),
          ],
        },
      ];
      return lineData;
    } else if (budget) {
      const lineData = [
        {
          id: "Budget: " + budget.budget_name,
          color: "hsl(115, 70%, 50%)",
          data: [
            { x: "Initial Budget: " + budget.budget_name, y: budget.amount },
            {
              x: "Example 1",
              y: Math.floor(Math.random() * budget.amount),
            },
            {
              x: "Example 2",
              y: Math.floor(Math.random() * budget.amount),
            },
            {
              x: "Example 3",
              y: Math.floor(Math.random() * budget.amount),
            },
            {
              x: "Example 4",
              y: Math.floor(Math.random() * budget.amount),
            },
            {
              x: "Example 5",
              y: Math.floor(Math.random() * budget.amount),
            },
          ],
        },
      ];
      return lineData;
    }
    return null;
  };

  const handleSortAsc = () => {};
  const handleSortDesc = () => {};

  return (
    <div className="dashboard">
      <SideBar />
      <div className="content p-3">
        <PageHeader page_name="My Budgets Dashboard" />
        <BudgetViewBanner />
        <Grid container spacing={1} sx={{ marginBottom: "100px" }}>
          <Grid item xs={12} style={{ height: "400px" }}>
            <Typography
              variant="h4"
              sx={{ textAlign: "center", fontWeight: "500", color: "#0e365e" }}
            >
              Budgets Overview
            </Typography>
            {lineChartData && selectedBudget && budgetExpenses ? (
              <div
                style={{
                  height: "100%",
                  width: "90%",
                  minWidth: "600px",
                  margin: "0 auto",
                }}
              >
                <Select
                  variant="outlined"
                  label="Budget Category"
                  value={selectedBudgetId}
                  onChange={(e) => setSelectedBudgetId(e.target.value)}
                  sx={{ width: "200px", textAlign: "center" }}
                >
                  {budgets.map((budget) => (
                    <MenuItem key={budget.id} value={budget.id}>
                      {budget.budget_name}
                    </MenuItem>
                  ))}
                </Select>
                <LineChart data={lineChartData} />
              </div>
            ) : (
              <div>
                <Skeleton variant="rectangular" height={400} />
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    fontWeight: "500",
                    color: "#0e365e",
                    mt: 2,
                  }}
                >
                  Your expense overview is loading...
                </Typography>
              </div>
            )}
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          spacing={2}
          sx={{ mt: "20px", height: "40px" }}
        >
          <Grid item sx={{ ml: "40px" }}>
            <Typography variant="h6" sx={{ color: "#05377f" }}>
              Sort:
              <Tooltip title="Sort Ascending" placement="top">
                <IconButton onClick={handleSortAsc}>
                  <ArrowUpwardIcon
                    fontSize="small"
                    sx={{ color: "#9da3ab", cursor: "pointer" }}
                    className="filter-arrows"
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Sort Descending" placement="top">
                <IconButton onClick={handleSortDesc}>
                  <ArrowDownwardIcon
                    fontSize="small"
                    sx={{ color: "#9da3ab", cursor: "pointer" }}
                    className="filter-arrows"
                  />
                </IconButton>
              </Tooltip>
            </Typography>
          </Grid>
          <Grid item xs>
            <Divider
              orientation="vertical"
              variant="middle"
              sx={{ borderColor: "#4CAF50", height: "100%" }}
            />
          </Grid>
          <Grid item>
            <Typography
              variant="h4"
              sx={{ fontWeight: "500", color: "#4CAF50" }}
            >
              Overview of Your Budgets
            </Typography>
          </Grid>
          <Grid item xs>
            <Divider
              orientation="vertical"
              variant="middle"
              sx={{ borderColor: "#4CAF50", height: "100%" }}
            />
          </Grid>
          <Grid item sx={{ mr: "10px" }}>
            <Chip
              label="Add Budget"
              component={Link}
              to="/budgetform"
              clickable
              sx={{
                backgroundColor: "#03a9f4",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#05377f",
                },
              }}
            />
          </Grid>
          <Grid item sx={{ mr: "40px" }}>
            <Chip
              label="Add Expense"
              component={Link}
              to="/budget-expense"
              clickable
              sx={{
                backgroundColor: "#03a9f4",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#05377f",
                },
              }}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default BudgetView;
