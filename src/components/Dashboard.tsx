import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { fetchCurrencyData } from "../services/currencyService";

interface Currency {
  code: string;
  name: string;
  rate: number;
}

const Dashboard = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [amountInINR, setAmountInINR] = useState<string>("0");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null
  );
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResult, setSearchResult] = useState<Currency | null>(null);

  const currencyNames = {
    USD: "United States Dollar",
    EUR: "Euro",
    GBP: "British Pound",
    JPY: "Japanese Yen",
    AUD: "Australian Dollar",
    CAD: "Canadian Dollar",
    CHF: "Swiss Franc",
    CNY: "Chinese Yuan",
    SEK: "Swedish Krona",
    NZD: "New Zealand Dollar",
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchCurrencyData();
        const selectedCurrencies = Object.keys(currencyNames).map((code) => ({
          code,
          name: currencyNames[code],
          rate: data[code],
        }));
        setCurrencies(selectedCurrencies);
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, []);

  const handleConvert = () => {
    if (selectedCurrency && amountInINR) {
      const amount = parseFloat(amountInINR);
      if (!isNaN(amount)) {
        setConvertedAmount(amount * selectedCurrency.rate);
      } else {
        setConvertedAmount(null);
      }
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;
    try {
      const data = await fetchCurrencyData();
      const rate = data[searchQuery.toUpperCase()];
      if (rate) {
        setSearchResult({
          code: searchQuery.toUpperCase(),
          name: currencyNames[searchQuery.toUpperCase()] || "Unknown Currency",
          rate: rate,
        });
      } else {
        setSearchResult(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>INR to Other Currencies</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount in INR"
        keyboardType="numeric"
        value={amountInINR}
        onChangeText={setAmountInINR}
      />
      <TextInput
        style={styles.input}
        placeholder="Search currency code (e.g., USD)"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      {searchResult && (
        <View style={styles.searchResult}>
          <Text style={styles.code}>{searchResult.code}</Text>
          <Text style={styles.name}>{searchResult.name}</Text>
          <Text style={styles.rate}>{searchResult.rate.toFixed(2)}</Text>
          <TouchableOpacity onPress={() => setSelectedCurrency(searchResult)}>
            <Text style={styles.selectButton}>Select</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={currencies}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedCurrency(item)}>
            <View style={styles.item}>
              <Text style={styles.code}>{item.code}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.rate}>{item.rate.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {selectedCurrency && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            {`Convert ${amountInINR} INR to ${selectedCurrency.name} (${selectedCurrency.code}):`}
          </Text>
          <TouchableOpacity
            style={styles.convertButton}
            onPress={handleConvert}
          >
            <Text style={styles.convertButtonText}>Convert</Text>
          </TouchableOpacity>
          {convertedAmount !== null && (
            <Text style={styles.convertedAmount}>
              {`${convertedAmount.toFixed(2)} ${selectedCurrency.code}`}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  code: {
    fontSize: 18,
    fontWeight: "bold",
  },
  name: {
    fontSize: 16,
  },
  rate: {
    fontSize: 16,
    fontWeight: "bold",
  },
  searchResult: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
  },
  selectButton: {
    color: "#007BFF",
    marginTop: 8,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resultText: {
    fontSize: 16,
    marginBottom: 10,
  },
  convertButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  convertButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  convertedAmount: {
    fontSize: 24,
    marginTop: 20,
  },
});

export default Dashboard;
