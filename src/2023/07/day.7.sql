WITH
    raw_input AS (
        SELECT
            L.[ordinal] AS [Row],
            left(L.[value], 5) AS [Hand],
            cast(substring(L.[value], 7, 4) AS int) AS [Bid]
        FROM 
            openrowset(BULK '/src/day.7.input.txt', SINGLE_CLOB) AS R
            CROSS APPLY string_split(R.[BulkColumn], CHAR(10), 1) AS L
        WHERE
            1 = 1
            AND (L.[value] <> '')
    ),
    input AS (
        SELECT
            src.[Row],
            src.[Hand],
            src.[Bid],
            src.[Card],
            count(*) AS [Count]
        FROM (
            SELECT
                R.[Row],
                R.[Hand],
                R.[Bid],
                substring(R.[Hand], I.[value], 1) AS [Card]
            FROM
                raw_input R
                CROSS JOIN generate_series(1, 5, 1) I
        ) src
        GROUP BY
            src.[Row],
            src.[Hand],
            src.[Bid],
            src.[Card]
    ),
    part_1_hand_types AS (
        SELECT
            I.[Row],
            I.[Hand],
            I.[Bid],
            CASE count(*)
                WHEN 1 THEN 0 -- Five of a Kind
                WHEN 2 THEN ( 
                    CASE 
                        WHEN EXISTS ( SELECT 1 FROM input WHERE ([Row] = I.[Row]) AND ([Count] = 4) ) THEN 1 -- Four of a Kind
                        ELSE 2 -- Full House
                    END 
                )
                WHEN 3 THEN ( 
                    CASE 
                        WHEN EXISTS ( SELECT 1 FROM input WHERE ([Row] = I.[Row]) AND ([Count] = 3) ) THEN 3 -- Three of a Kind
                        ELSE 4 -- Two Pair
                    END 
                )
                WHEN 4 THEN 5 -- One Pair
                ELSE 6 -- High Card 
            END AS [HandType]
        FROM
            input I
        GROUP BY
            I.[Row],
            I.[Hand],
            I.[Bid]
    ),
    part_1 AS (
        SELECT
            sum(src.[Winnings]) AS [Answer]
        FROM (
            SELECT
                ([Bid] * row_number() OVER ( ORDER BY [HandType] DESC, charindex(substring([Hand], 1, 1), 'AKQJT98765432') DESC, charindex(substring([Hand], 2, 1), 'AKQJT98765432') DESC, charindex(substring([Hand], 3, 1), 'AKQJT98765432') DESC, charindex(substring([Hand], 4, 1), 'AKQJT98765432') DESC, charindex(substring([Hand], 5, 1), 'AKQJT98765432') DESC )) AS [Winnings]
            FROM
                part_1_hand_types
        ) AS src
    ),
    part_2_hand_types AS (
        SELECT
            I.[Row],
            I.[Hand],
            I.[Bid],
            CASE count(*) - iif(EXISTS ( SELECT 1 FROM input WHERE ([Row] = I.[Row]) AND ([Card] = 'J') ), 1, 0)
                WHEN 0 THEN 0 -- Five of a Kind
                WHEN 1 THEN 0 -- Five of a Kind
                WHEN 2 THEN ( 
                    CASE sum(CASE WHEN I.[Card] = 'J' THEN I.[Count] ELSE 0 END)
                        WHEN 0 THEN (
                            CASE 
                                WHEN EXISTS ( SELECT 1 FROM input WHERE ([Row] = I.[Row]) AND ([Card] <> 'J') AND ([Count] = 4) ) THEN 1 -- Four of a Kind
                                ELSE 2 -- Full House
                            END 
                        )
                        WHEN 1 THEN (
                            CASE 
                                WHEN EXISTS ( SELECT 1 FROM input WHERE ([Row] = I.[Row]) AND ([Card] <> 'J') AND ([Count] = 3) ) THEN 1 -- Four of a Kind
                                ELSE 2 -- Full House
                            END 
                        )
                        WHEN 2 THEN 1 -- Four of a Kind
                        WHEN 3 THEN 1 -- Four of a Kind
                    END 
                )
                WHEN 3 THEN ( 
                    CASE sum(CASE WHEN I.[Card] = 'J' THEN I.[Count] ELSE 0 END)
                        WHEN 0 THEN (
                            CASE 
                                WHEN EXISTS ( SELECT 1 FROM input WHERE ([Row] = I.[Row]) AND ([Card] <> 'J') AND ([Count] = 3) ) THEN 3 -- Three of a Kind
                                ELSE 4 -- Two Pair
                            END 
                        )
                        WHEN 1 THEN 3 -- Three of a Kind
                        WHEN 2 THEN 3 -- Three of a Kind
                    END 
                )
                WHEN 4 THEN 5 -- One Pair
                ELSE 6 -- High Card 
            END AS [HandType]
        FROM
            input I
        GROUP BY
            I.[Row],
            I.[Hand],
            I.[Bid]
    ),
    part_2 AS (
        SELECT
            sum(src.[Winnings]) AS [Answer]
        FROM (
            SELECT
                ([Bid] * row_number() OVER ( ORDER BY [HandType] DESC, charindex(substring([Hand], 1, 1), 'AKQT98765432J') DESC, charindex(substring([Hand], 2, 1), 'AKQT98765432J') DESC, charindex(substring([Hand], 3, 1), 'AKQT98765432J') DESC, charindex(substring([Hand], 4, 1), 'AKQT98765432J') DESC, charindex(substring([Hand], 5, 1), 'AKQT98765432J') DESC )) AS [Winnings]
            FROM
                part_2_hand_types
        ) AS src
    )
SELECT
    P1.[Answer] AS [Part1],
    P2.[Answer] AS [Part2]
FROM
    part_1 AS P1,
    part_2 AS P2;