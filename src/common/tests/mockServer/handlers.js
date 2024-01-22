import {rest} from 'msw';
import {fullTournamentFactory, tournamentFactory} from '@duelme/testing-library/dist/factories/tournaments';
import {fetchProfileResponseFactory} from '@duelme/testing-library/dist/factories/responses/CurrentUserService';
import {friendFactory} from '@duelme/testing-library/dist/factories/friends';
import {BASE_API_URL, BASE_PUBLIC_API_URL, BASE_APP_API_URL, BASE_ADMIN_API_URL} from '@duelme/js-constants/dist/api';
import {BASE_GAMES_URL} from '@duelme/apisdk/dist/services/GameService';
import {privateMatchFactory} from '@duelme/testing-library/dist/factories/privateMatch';
import {walletFactory} from '@duelme/testing-library/dist/factories/wallets';
import {matchFactory} from '@duelme/testing-library/dist/factories/matches';
import {challengeActiveUserFactory} from '@duelme/testing-library/dist/factories/challengeActiveUsers';
import {recentWinnersMockResponse} from '@duelme/testing-library/dist/factories/responses/RecentWinnersService';
import {gamesMockResponse} from '@duelme/testing-library/dist/factories/responses/GameService';
import {chatHistoryFactory} from '@duelme/testing-library/dist/factories/chats';
import {matchHistoryFactory} from '@duelme/testing-library/dist/factories/matchHistory';
import {liveStreamFactory} from '@duelme/testing-library/dist/factories/liveStreams';
import {friendshipEntityFactory} from '@duelme/testing-library/dist/factories/friendships';
import {rankedGameAccountFactory} from '@duelme/testing-library/dist/factories/rankings';

export const handlers = [
  rest.delete(`${BASE_ADMIN_API_URL}/redis/cache/:id`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_PUBLIC_API_URL}/tournaments/:id`, (req, res, ctx) => {
    return res(ctx.json(fullTournamentFactory.build({id: req.params.id})), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_PUBLIC_API_URL}/default-avatars`, (req, res, ctx) => {
    return res(
      ctx.json([
        {
          url: 'https://test-url.com/1',
          fullBodyPosture: 'https://test-posture.com/1',
        },
        {
          url: 'https://test-url.com/2',
          fullBodyPosture: 'https://test-posture.com/2',
        },
      ]),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.get(`${BASE_PUBLIC_API_URL}/tournaments`, (req, res, ctx) => {
    return res(ctx.json([tournamentFactory.build()]), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/tournaments/:id/signup`, (req, res, ctx) => {
    return res(ctx.json(fullTournamentFactory.build({id: req.params.id})), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/tournaments/:id/quit`, (req, res, ctx) => {
    return res(ctx.json(fullTournamentFactory.build({id: req.params.id})), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_PUBLIC_API_URL}/recent-winners`, (req, res, ctx) => {
    return res(ctx.json(recentWinnersMockResponse), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/payments/circle/wire/bank-accounts`, (req, res, ctx) => {
    return res(ctx.json([]), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/pending-match-chats`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.put(`${BASE_APP_API_URL}/friendrequests/:id`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.delete(`${BASE_APP_API_URL}/friendrequests/:id`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.delete(`${BASE_APP_API_URL}/payments/circle/wire/deposit/pending/:id`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/payments/coinqvest/withdraw/commit`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/friend-chats/:id`, (req, res, ctx) => {
    return res(
      ctx.json(chatHistoryFactory({entityId: req.params.id, entityType: 'FRIEND_CHAT_MESSAGE'})),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.get(`${BASE_APP_API_URL}/pending-friend-chats`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.delete(`${BASE_APP_API_URL}/pending-friend-chats/:id`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/matches/:matchid/scores/:scoreid/confirm`, (req, res, ctx) => {
    return res(ctx.json(matchFactory.build({id: req.params.matchid})), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/private-match-chats/:id`, (req, res, ctx) => {
    return res(
      ctx.json(chatHistoryFactory({entityId: req.params.id, entityType: 'PRIVATE_MATCH_CHAT_MESSAGE'})),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.get(`${BASE_APP_API_URL}/lobby-chats/:id`, (req, res, ctx) => {
    return res(
      ctx.json(chatHistoryFactory({entityId: req.params.id, entityType: 'LOBBY_CHAT_MESSAGE'})),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.get(`${BASE_APP_API_URL}/match-chats/:id`, (req, res, ctx) => {
    return res(
      ctx.json(chatHistoryFactory({entityId: req.params.id, entityType: 'MATCH_CHAT_MESSAGE'})),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.post(`${BASE_APP_API_URL}/payments/coinqvest/withdraw/create`, (req, res, ctx) => {
    return res(
      ctx.json({
        withdrawal: {
          id: '124',
          targetBlockchain: 'XLM',
          targetAssetCode: 'XLM',
          targetAmount: '29.5843503',
          targetAccount: {
            account: 'GDLIGR5SZMNHJQVFPA5VVY2GIZSDFQIQJZUJQJ5HSUAD4X2O634I2K72',
          },
          fee: '1',
        },
      }),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.get(`${BASE_APP_API_URL}/wallets`, (req, res, ctx) => {
    const wallet = walletFactory.build({balance: 99, bonus: 7});
    return res(ctx.json({wallets: [wallet]}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/payments/coinqvest/assets/`, (req, res, ctx) => {
    return res(
      ctx.json({
        assets: [
          {
            withdrawals: {
              enabled: true,
              min: 1,
              minUSD: 1,
              feeFixed: 2,
              feeFixedUSD: 2,
              feePercent: 3,
            },
            id: 'XLM:NATIVE',
            assetCode: 'XLM',
            name: 'Lumens',
            type: 'CRYPTO',
            enabled: true,
            issuer: {
              id: 'XLM:NATIVE',
              name: 'Stellar Development Foundation (SDF)',
              path: '/api/v1/asset-issuer?id=XLM:NATIVE',
            },
          },
        ],
      }),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.post(`${BASE_API_URL}/oauth/token`, (req, res, ctx) => {
    return res(
      ctx.json({
        access_token: '8C8tr48qFkVR107R8PfmrPFsSaI',
        token_type: 'bearer',
        refresh_token: '0TB9vCQQzrlLsbrUQTDzU_UPSvM',
        expires_in: 4999,
        scope: 'read write trust',
      }),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.post(`${BASE_PUBLIC_API_URL}/signup`, (req, res, ctx) => {
    return res(ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(BASE_GAMES_URL, (req, res, ctx) => {
    return res(ctx.json(gamesMockResponse.content), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/users/challenging`, (req, res, ctx) => {
    return res(ctx.json([challengeActiveUserFactory.build()]), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/users/me`, (req, res, ctx) => {
    return res(
      ctx.json(fetchProfileResponseFactory.params({addGameAccounts: true}).build()),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.post(`${BASE_APP_API_URL}/users/me/twitch`, (req, res, ctx) => {
    return res(
      ctx.json(fetchProfileResponseFactory.params({addGameAccounts: true}).build()),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.get(`${BASE_APP_API_URL}/users/me/mobile/tokens`, (req, res, ctx) => {
    return res(ctx.json([]), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/users/me/steam`, (req, res, ctx) => {
    return res(
      ctx.json(fetchProfileResponseFactory.params({addGameAccounts: true}).build()),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.get(`${BASE_APP_API_URL}/users/me/verification_link`, (req, res, ctx) => {
    return res(
      ctx.json({
        url: 'http://fake-api-url/verification',
        status: null,
      }),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),

  rest.get(`${BASE_APP_API_URL}/users/me/status`, (req, res, ctx) => {
    return res(ctx.json([]), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/matchmaking/recommendation`, (req, res, ctx) => {
    return res(
      ctx.json({
        matchmakingRecommendationRequest: {
          gameId: 1,
          regionId: 1,
          matchTypeId: 1,
          platformName: 'PC',
          platformType: 'PC',
          currency: 'USD',
          amount: '10',
        },
        matchmakingFindStatistics: {
          USD_5: 1,
        },
        averageWaitingTimeSeconds: 300,
        searchingPlayers: 0,
      }),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),

  rest.get(`${BASE_APP_API_URL}/matchmaking/open`, (req, res, ctx) => {
    return res(
      ctx.json([
        {
          amount: '5',
          crossPlayEnabled: true,
          currency: 'USD',
          id: '7435f485-6958-4606-8ae3-4731ebcf3e9c',
          matchTypeId: '1',
          platformName: 'PC',
          platformType: 'PC',
          regionId: '1',
        },
      ]),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.post(`${BASE_APP_API_URL}/matchmaking/find`, (req, res, ctx) => {
    return res(
      ctx.json({
        matchTypeId: 1,
        gameAccountId: 'ad7326d6-21f4-48fa-9e79-b3d3b78bea7b',
        bet: {
          amount: 5,
          currency: 'USD',
        },
      }),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.delete(`${BASE_APP_API_URL}/matchmaking/find`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/matchmaking/accept`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_PUBLIC_API_URL}/buyins`, (req, res, ctx) => {
    return res(
      ctx.json({
        matchmaking: [5, 10, 20, 40],
        lobbies: [5, 10, 20, 40],
        privateMatch: [5, 10, 20, 40, 80, 120],
        scheduledMatch: [5, 10, 20, 40, 80, 120],
      }),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.post(`${BASE_APP_API_URL}/private-match`, (req, res, ctx) => {
    return res(ctx.json(privateMatchFactory.build()), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/private-match/:id/members`, (req, res, ctx) => {
    return res(
      ctx.json(privateMatchFactory.params({id: req.params.id}).build()),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.post(`${BASE_APP_API_URL}/private-match/:id/:team`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.delete(`${BASE_APP_API_URL}/private-match/:id/members`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.delete(`${BASE_APP_API_URL}/private-match/:id/members/:memberId`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/private-match/:id/members/:memberId`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/private-match-chats/:id`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/private-match/:id`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/tutorial`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_PUBLIC_API_URL}/feature-flags`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/scheduled/matches/`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/scheduled/matches/`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.put(`${BASE_APP_API_URL}/scheduled/matches/:matchId`, (req, res, ctx) => {
    if (!req.params.matchId) {
      return res(ctx.status(404), ctx.json({}));
    }
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.delete(`${BASE_APP_API_URL}/scheduled/matches/:matchId`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/matches/:matchId`, (req, res, ctx) => {
    return res(ctx.json(matchFactory.build({id: req.params.matchId})), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/matches/:matchId/scores`, (req, res, ctx) => {
    return res(ctx.json(matchFactory.build({id: req.params.matchId})), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/matches/:matchId/issues`, (req, res, ctx) => {
    return res(ctx.json(matchFactory.build({id: req.params.matchId})), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/match-chats/:id`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_PUBLIC_API_URL}/buyins`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_PUBLIC_API_URL}/rankings/:gameId/DUBBZ`, (req, res, ctx) => {
    return res(
      ctx.json({
        gameId: 1,
        rankedGameAccounts: [...new Array(8)].map(() => rankedGameAccountFactory.build()),
      }),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.get(`${BASE_PUBLIC_API_URL}/check-region`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/quick/invite`, (req, res, ctx) => {
    return res(ctx.json([]), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/friendrequests`, (req, res, ctx) => {
    return res(
      ctx.json([
        friendshipEntityFactory.build({
          userIdTo: 'bd049860-97d7-4703-89ea-f3c36c7ded87',
          id: '59680389-7cde-4363-8035-68ba072fe99a',
          usernameFrom: 'user2',
        }),
      ]),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.post(`${BASE_APP_API_URL}/friendrequests`, (req, res, ctx) => {
    return res(ctx.json(), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/pending-notifications`, (req, res, ctx) => {
    return res(
      ctx.json({
        pendingNotifications: [],
        notifications: [],
      }),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.delete(`${BASE_APP_API_URL}/notifications/:id`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.put(`${BASE_APP_API_URL}/pending-notifications`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/quick/statuses`, (req, res, ctx) => {
    return res(
      ctx.json([friendFactory.build({friendshipId: '444'}), friendFactory.build({status: 'ONLINE'})]),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.post(`${BASE_APP_API_URL}/quick/challenge`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),

  rest.post(`${BASE_PUBLIC_API_URL}/verify`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/payments/nowpayments/checkout`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/payments/nowpayments/withdraw`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/friendsearch`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/payments/paypal/create`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/payments/paypal/success`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/payments/paypal/cancel`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/payments/paypal/withdraw`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/payments/paypal/withdraw/email`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_APP_API_URL}/payments/nowpayments/withdraw/email`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_ADMIN_API_URL}/users/:id/add-funds`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.post(`${BASE_ADMIN_API_URL}/users/:id/subtract-funds`, (req, res, ctx) => {
    return res(ctx.json({}), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
  rest.get(`${BASE_APP_API_URL}/users/:id`, (req, res, ctx) => {
    return res(
      ctx.json(fetchProfileResponseFactory.params({id: req.params.id, addGameAccounts: true}).build()),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.get(`${BASE_APP_API_URL}/users/me/match-history`, (req, res, ctx) => {
    return res(
      ctx.json({page: 0, totalPages: 2, result: [matchHistoryFactory.build({id: req.params.pageNo})]}),
      ctx.set('Access-Control-Allow-Origin', '*'),
    );
  }),
  rest.get(`${BASE_PUBLIC_API_URL}/live-matches`, (req, res, ctx) => {
    return res(ctx.json([liveStreamFactory.build()]), ctx.set('Access-Control-Allow-Origin', '*'));
  }),
];
