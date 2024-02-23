import React, { useState } from "react";
import { Container, VStack, Input, Button, Text, useClipboard, useToast } from "@chakra-ui/react";
import { FaLink, FaCopy } from "react-icons/fa";

const Index = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const { hasCopied, onCopy } = useClipboard(shortenedUrl);
  const toast = useToast();

  const handleShortenUrl = async () => {
    try {
      // Replace this with your actual fetch or axios call to the backend API
      const response = await fetch("https://fantastic-eureka-pjrxqq9jjggh96rx-8000.app.github.dev/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setShortenedUrl(data.short_url);
      toast({
        title: "URL shortened successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error shortening URL",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container centerContent p={8}>
      <VStack spacing={4} width="100%">
        <Input placeholder="Enter URL here..." value={url} onChange={(e) => setUrl(e.target.value)} />
        <Button leftIcon={<FaLink />} colorScheme="blue" onClick={handleShortenUrl} isDisabled={!url}>
          Shorten URL
        </Button>
        {shortenedUrl && (
          <VStack spacing={2} width="100%">
            <Text>Shortened URL:</Text>
            <Input value={shortenedUrl} isReadOnly />
            <Button leftIcon={<FaCopy />} onClick={onCopy} colorScheme="teal">
              {hasCopied ? "Copied!" : "Copy URL"}
            </Button>
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
