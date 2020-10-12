import React, { useState, useEffect, useContext, useRef } from "react";
import ReactDOM from "react-dom";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { useReactToPrint } from "react-to-print";
import { CSVLink } from "react-csv";
import {
  useDisclosure,
  Box,
  Flex,
  Heading,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Spinner,
  Image,
  Text,
  Textarea,
  FormControl,
  FormErrorMessage,
  Grid,
} from "@chakra-ui/core";
import { format } from "date-fns";
import { AiOutlineQrcode, AiOutlineExport } from "react-icons/ai";
import { MdPersonAdd } from "react-icons/md";
import { AuthStateContext } from "./AuthContext";
import { getAnalytics } from "./adapters/shared/firebase";
import "./qr-code.css";

const formatContact = ({ date, contact }) => ({
  date: format(date, "dd/MM/yyyy HH:mm"),
  ...contact,
});

const retrieveContacts = async ({
  getContacts,
  currentRestaurantUser,
  setContacts,
  setNeedToRestorePrivateKey,
}) => {
  try {
    const contacts = await getContacts({
      restaurantId: currentRestaurantUser.id,
      today: new Date(),
    });
    const formattedContacts = (contacts || [])
      .sort((a, b) => b.date - a.date)
      .map(formatContact);
    setNeedToRestorePrivateKey(false);
    setContacts(formattedContacts);
  } catch (err) {
    console.error("Error while retrieving contacts", {
      privateKey: localStorage.getItem("privateKey"),
      err,
    });
    setNeedToRestorePrivateKey(true);
  }
};

class QRCode extends React.Component {
  render() {
    return (
      <Image
        src={this.props.qrCode}
        width="100%"
        heigh="100%"
        className="qr-code"
      />
    );
  }
}

QRCode.propTypes = {
  qrCode: PropTypes.string.isRequired,
};

const HeadCell = ({ name }) => (
  <Heading as="h6" w="1O0%" fontSize="1em" textAlign="center">
    {name}
  </Heading>
);

const RowCell = ({ data, isEven }) => (
  <Box w="100%" bg={isEven ? "gray.100" : "gray.50"} padding="4px">
    {data}
  </Box>
);

export const ContactList = ({
  getContacts,
  restorePrivateKey,
  restaurantRepository,
}) => {
  const history = useHistory();
  const { currentRestaurantUser } = useContext(AuthStateContext);
  const [contacts, setContacts] = useState(null);
  const [restaurant, setRestaurant] = useState();
  const [needToRestorePrivateKey, setNeedToRestorePrivateKey] = useState(false);
  const [backupWords, setBackupWords] = useState();
  const [isRetrievingPrivateKey, setIsRetrievingPrivateKey] = useState(false);
  const [retrievePrivateKeyError, setRetrievePrivateKeyError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (restaurant) {
      retrieveContacts({
        getContacts,
        currentRestaurantUser,
        setContacts,
        setNeedToRestorePrivateKey,
      });
    }
  }, [
    restaurant,
    setContacts,
    getContacts,
    currentRestaurantUser,
    setNeedToRestorePrivateKey,
  ]);

  useEffect(() => {
    let retriesCount = 0;
    const retrieveRestaurant = async () => {
      try {
        const restaurant = await restaurantRepository.get({
          restaurantId: currentRestaurantUser.id,
        });
        setRestaurant(restaurant);
      } catch (err) {
        if (retriesCount > 3) {
          throw err;
        }
        setTimeout(() => {
          retrieveRestaurant();
        }, 250 * 2 ** retriesCount);
        retriesCount += 1;
      }
    };
    retrieveRestaurant();
  }, [setRestaurant, currentRestaurantUser, restaurantRepository]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const openQrCodeModal = () => {
    onOpen();
  };

  const redirectToAddContactForm = () => {
    history.push(`/form/${restaurant.id}?redirectToDashboard`);
  };

  const handleBackupWordsChange = (event) => {
    setBackupWords(event.target.value);
  };

  const doRestorePrivateKey = async (event) => {
    event.preventDefault();
    setRetrievePrivateKeyError(null);
    setIsRetrievingPrivateKey(true);
    try {
      await restorePrivateKey({
        restaurantId: restaurant.id,
        words: backupWords.trim(),
      });
      setIsRetrievingPrivateKey(false);
      await retrieveContacts({
        getContacts,
        currentRestaurantUser,
        setContacts,
        setNeedToRestorePrivateKey,
      });
    } catch (err) {
      setRetrievePrivateKeyError(
        "Mauvaise liste de mots. Veuillez réessayer. Respectez bien les espaces entre les mots"
      );
      setIsRetrievingPrivateKey(false);
    }
  };

  const qrCodeRef = useRef();

  const exportCsvRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => qrCodeRef.current,
  });

  const handleExportClick = () => {
    getAnalytics().logEvent("contacts_exported", {
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      contactsCount: (contacts || []).length,
    });
    ReactDOM.findDOMNode(exportCsvRef.current).click();
    toast({
      title: "Fichiers téléchargé",
      description: "Regardez dans votre dossier téléchargement",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const csvData = [
    ["Date", "Prénom", "Nom", "Téléphone"],
    ...(contacts || []).map(({ date, firstName, lastName, phoneNumber }) => [
      date,
      firstName,
      lastName,
      phoneNumber,
    ]),
  ];

  return (
    <Box>
      {restaurant ? (
        <Flex alignItems="center" direction="column">
          <Flex direction="column">
            <Heading
              marginBottom="0.5em"
              textAlign="center"
              as="h1"
              fontSize="1.5em"
            >
              {restaurant.name}
            </Heading>
            <Button
              marginBottom="1em"
              leftIcon={AiOutlineQrcode}
              variantColor="teal"
              variant="solid"
              onClick={openQrCodeModal}
              size="lg"
            >
              QR Code à mettre à disposition de vos clients
            </Button>
            {needToRestorePrivateKey === false && (
              <>
                <Button
                  leftIcon={MdPersonAdd}
                  variantColor="green"
                  color="white"
                  variant="solid"
                  onClick={redirectToAddContactForm}
                  size="lg"
                  marginBottom="1em"
                >
                  Ajouter un client
                </Button>
                <Button
                  leftIcon={AiOutlineExport}
                  variantColor="blue"
                  color="white"
                  variant="solid"
                  onClick={handleExportClick}
                  size="lg"
                >
                  Exporter les contacts
                </Button>
                <CSVLink
                  ref={exportCsvRef}
                  style={{ display: "none" }}
                  data={csvData}
                  filename={"resto-covid.csv"}
                  target="_blank"
                >
                  Exporter les contacts
                </CSVLink>
              </>
            )}
          </Flex>
          <Modal
            onClose={onClose}
            isOpen={isOpen}
            isCentered
            scrollBehavior="outside"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>QR Code d'ajout d'information client</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box>
                  <QRCode qrCode={restaurant.qrCode} ref={qrCodeRef} />
                  <Flex justify="center">
                    <Button onClick={handlePrint} variantColor="teal">
                      Imprimer le QR code
                    </Button>
                  </Flex>
                </Box>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      ) : (
        <Spinner />
      )}
      {contacts === null && !needToRestorePrivateKey ? (
        <Spinner />
      ) : (
        <>
          <Heading
            as="h2"
            textAlign="center"
            marginTop="1em"
            marginBottom="0.5em"
            fontSize="1.2em"
          >
            Client des 14 derniers jours :
          </Heading>
          {needToRestorePrivateKey ? (
            <Box color="black" p={4}>
              <Text marginBottom="1em">
                Cette appareil n'est pas configuré pour accéder aux contacts.
                Veuillez entrez la liste des mots qui vous a été fournie à
                l'inscription :
              </Text>
              <FormControl
                isRequired
                isInvalid={retrievePrivateKeyError !== null}
              >
                <Textarea
                  onChange={handleBackupWordsChange}
                  value={backupWords}
                />
                <FormErrorMessage>{retrievePrivateKeyError}</FormErrorMessage>
              </FormControl>
              <Flex justify="center">
                <Button
                  mt={4}
                  variantColor="teal"
                  isLoading={isRetrievingPrivateKey}
                  onClick={doRestorePrivateKey}
                  type="submit"
                >
                  Valider
                </Button>
              </Flex>
            </Box>
          ) : (
            <Grid
              templateColumns="repeat(4, 1fr)"
              marginTop="1em"
              fontSize={["0.8em", "0.8em", "1em"]}
            >
              <HeadCell name="Date" />
              <HeadCell name="Prénom" />
              <HeadCell name="Nom" />
              <HeadCell name="Téléphone" />
              {contacts
                .sort((a, b) => b.date - a.date)
                .map((contact, index) => (
                  <React.Fragment key={`${index}${contact.phoneNumber}`}>
                    <RowCell data={contact.date} isEven={index % 2 === 0} />
                    <RowCell
                      data={contact.firstName}
                      isEven={index % 2 === 0}
                    />
                    <RowCell data={contact.lastName} isEven={index % 2 === 0} />
                    <RowCell
                      data={contact.phoneNumber}
                      isEven={index % 2 === 0}
                    />
                  </React.Fragment>
                ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

ContactList.propTypes = {
  getContacts: PropTypes.func.isRequired,
  restorePrivateKey: PropTypes.func.isRequired,
  restaurantRepository: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }).isRequired,
};
