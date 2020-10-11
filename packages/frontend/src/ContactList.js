import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
import PropTypes from "prop-types";
import { useReactToPrint } from "react-to-print";
import {
  useDisclosure,
  Box,
  Flex,
  Heading,
  ButtonGroup,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Spinner,
  List,
  ListItem,
  Image,
  Text,
  Textarea,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/core";
import { format } from "date-fns";
import { AiOutlineQrcode } from "react-icons/ai";
import { MdPersonAdd } from "react-icons/md";
import { AuthStateContext } from "./AuthContext";
import { AddContactForm } from "./AddContactForm";

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
    setNeedToRestorePrivateKey(false);
    setContacts(contacts);
  } catch (err) {
    setNeedToRestorePrivateKey(true);
  }
};

class QRCode extends React.Component {
  render() {
    return <Image src={this.props.qrCode} width="100%" heigh="100%" />;
  }
}

QRCode.propTypes = {
  qrCode: PropTypes.string.isRequired,
};

export const ContactList = ({
  addContact,
  getContacts,
  restorePrivateKey,
  restaurantRepository,
}) => {
  const { currentRestaurantUser } = useContext(AuthStateContext);
  const [contacts, setContacts] = useState(null);
  const [restaurant, setRestaurant] = useState();
  const [modalScreen, setModalScreen] = useState("qrcode");
  const [needToRestorePrivateKey, setNeedToRestorePrivateKey] = useState(false);
  const [backupWords, setBackupWords] = useState();
  const [isRetrievingPrivateKey, setIsRetrievingPrivateKey] = useState(false);
  const [retrievePrivateKeyError, setRetrievePrivateKeyError] = useState(null);

  useEffect(() => {
    retrieveContacts({
      getContacts,
      currentRestaurantUser,
      setContacts,
      setNeedToRestorePrivateKey,
    });
  }, [
    setContacts,
    getContacts,
    currentRestaurantUser,
    setNeedToRestorePrivateKey,
  ]);

  useEffect(() => {
    const retrieveRestaurant = async () => {
      const restaurant = await restaurantRepository.get({
        restaurantId: currentRestaurantUser.id,
      });
      setRestaurant(restaurant);
    };
    retrieveRestaurant();
  }, [setRestaurant, currentRestaurantUser, restaurantRepository]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const openQrCodeModal = () => {
    setModalScreen("qrcode");
    onOpen();
  };

  const openAddContactModal = () => {
    setModalScreen("addcontact");
    onOpen();
  };

  const onContactAdded = useCallback(
    ({ date, ...contact }) => {
      onClose();
      setContacts([{ contact, date }].concat(contacts));
    },
    [onClose, setContacts, contacts]
  );

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
  const handlePrint = useReactToPrint({
    content: () => qrCodeRef.current,
  });

  return (
    <Box>
      {restaurant ? (
        <Flex alignItems="center" direction="column">
          <Box>
            <Heading>{restaurant.name}</Heading>
          </Box>
          <ButtonGroup spacing={4} marginTop="1em">
            <Button
              leftIcon={AiOutlineQrcode}
              variantColor="teal"
              variant="solid"
              onClick={openQrCodeModal}
            >
              Afficher le QR Code
            </Button>
            <Button
              leftIcon={MdPersonAdd}
              variantColor="green"
              color="white"
              variant="solid"
              onClick={openAddContactModal}
            >
              Ajouter un client
            </Button>
          </ButtonGroup>
          <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                {modalScreen === "qrcode"
                  ? "QR Code d'ajout d'information client"
                  : "Ajout d'un client"}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {modalScreen === "qrcode" ? (
                  <Box>
                    <QRCode qrCode={restaurant.qrCode} ref={qrCodeRef} />
                    <Flex justify="center">
                      <Button onClick={handlePrint} variantColor="teal">
                        Imprimer le QR code
                      </Button>
                    </Flex>
                  </Box>
                ) : (
                  <AddContactForm
                    onContactAdded={onContactAdded}
                    addContact={addContact}
                    restaurantId={restaurant.id}
                    saveInputs={false}
                  />
                )}
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
            <Flex
              as={List}
              alignItems="center"
              direction="column"
              spacing={3}
              marginTop="1em"
            >
              {contacts
                .sort((a, b) => b.date - a.date)
                .map(({ date, contact }, index) => (
                  <ListItem key={`${index}${contact.phoneNumber}`}>
                    {format(date, "dd/MM/yyyy HH:mm")} - {contact.firstName}{" "}
                    {contact.lastName} - {contact.email} - {contact.phoneNumber}
                  </ListItem>
                ))}
            </Flex>
          )}
        </>
      )}
    </Box>
  );
};

ContactList.propTypes = {
  addContact: PropTypes.func.isRequired,
  getContacts: PropTypes.func.isRequired,
  restorePrivateKey: PropTypes.func.isRequired,
  restaurantRepository: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }).isRequired,
};
