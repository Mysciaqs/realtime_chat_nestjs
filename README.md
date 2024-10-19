## Przykładowe .env
```bash
# Port aplikacji
PORT=3000
# Nazwa hosta redis
REDIS_HOST=redis
# Port serwera redis
REDIS_PORT=6379
# Czas w sekundach, po których klucz w redisie zostanie usunięty
TIME_TO_LIVE=1209600
# Ilość historycznych wiadomości, która jest zwracana (-1 - wszystkie, 1-∞ podana ilość)
MESSAGE_HISTORY_AMOUNT=-1
```

## Uruchomienie
Wymagany jest zainstalowany Docker oraz Docker Compose.
W folderze **realtime_chat_nestjs** należy stworzyć plik **.env** według przykładu powyżej.
Aby uruchomić aplikację należy będąc w tym samym folderze uruchomić w terminalu polecenie `docker-compose up --build`.
Jeśli chcesz dostać się do **redis-cli** należy użyć polecenia `docker exec realtime-chat-redis redis-cli`, kiedy aplikacja jest uruchomiona.

## Co zawiera
 - endpointy
   - /conversation/create, który przyjmuje dwie wartości - user1 oraz user2.
     ```bash
     {
        "user1": "firstUserId",
        "user2": "secondUserId"
     }
     ```
 - websockety
   - event joinRoom, który przyjmuje jako body JSON:
     ```bash
     {
        "room": "conv:firstUserId:secondUserId"
     }
     ```
     Po dołączeniu do pokoju zwracana jest historia wiadomości poprzez emit messageHistory.
   - event message, który przyjmuje jako body JSON:
     ```bash
     {
        "room": "conv:firstUserId:secondUserId",
        "userId": "firstUserId",
        "content": "First user message 123"
     }
     ```
     Po wysłaniu wiadomości emitowana jest nowa wiadomość jako emit newMessage.
   - event leaveRoom, który przyjmuje jako body JSON:
     ```bash
     {
        "room": "conv:firstUserId:secondUserId"
     }
     ```
     
