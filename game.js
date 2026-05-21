import pygame
import sys
import random

pygame.init()

# SCREEN
WIDTH = 400
HEIGHT = 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Flappy Teddy")

clock = pygame.time.Clock()

# COLORS
SKY = (135, 206, 235)
GREEN = (0, 200, 0)
WHITE = (255, 255, 255)

# FONTS
font_big = pygame.font.SysFont(None, 60)
font = pygame.font.SysFont(None, 36)
font_small = pygame.font.SysFont(None, 28)

# STATES
HOME = 0
PLAYING = 1
GAME_OVER = 2
state = HOME

# LOAD IMAGES 🧸🍪💀
teddy_img = pygame.image.load("teddy.png")
cookie_img = pygame.image.load("cookie.png")
skull_img = pygame.image.load("skull.png")

# RESIZE IMAGES
teddy_img = pygame.transform.scale(teddy_img, (45, 45))
cookie_img = pygame.transform.scale(cookie_img, (30, 30))
skull_img = pygame.transform.scale(skull_img, (50, 50))

# TEDDY
teddy_x = 100
teddy_y = 300
gravity = 0.5
velocity = 0

# CLOUDS ☁️
clouds = [
    {"x": 50, "y": 100},
    {"x": 200, "y": 150},
    {"x": 350, "y": 80}
]

# PIPES
pipe_width = 70
pipe_speed = 4
pipe_gap = 220
pipes = []

# SCORE 🍪
cookies = 0
best_cookies = 0


def create_pipe():
    height = random.randint(120, 380)
    return {"x": WIDTH, "height": height}


pipes.append(create_pipe())


def reset_game():
    global teddy_y, velocity, pipes, cookies, state, pipe_gap

    teddy_y = 300
    velocity = 0
    pipes = [create_pipe()]
    cookies = 0
    pipe_gap = 220
    state = PLAYING


while True:

    screen.fill(SKY)

    for event in pygame.event.get():

        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        if event.type == pygame.KEYDOWN:

            # HOME START
            if state == HOME and event.key == pygame.K_SPACE:
                reset_game()

            # JUMP
            elif state == PLAYING and event.key == pygame.K_SPACE:
                velocity = -10

            # RESTART
            elif state == GAME_OVER and event.key == pygame.K_SPACE:
                reset_game()

    # 🌥️ CLOUDS
    for c in clouds:
        pygame.draw.circle(screen, WHITE, (c["x"], c["y"]), 20)
        c["x"] -= 1
        if c["x"] < -50:
            c["x"] = WIDTH + 50

    # 🏠 HOME SCREEN
    if state == HOME:

        title = font_big.render("Flappy Teddy", True, WHITE)
        subtitle = font.render("Press SPACE to Start", True, WHITE)

        screen.blit(title, (70, 200))
        screen.blit(subtitle, (70, 280))

    # 🎮 GAMEPLAY
    elif state == PLAYING:

        velocity += gravity
        teddy_y += velocity

        # move pipes
        for p in pipes:
            p["x"] -= pipe_speed

        if pipes[-1]["x"] < 180:
            pipes.append(create_pipe())

        if pipes[0]["x"] < -pipe_width:
            pipes.pop(0)
            cookies += 1

            # 🔥 difficulty increases
            if cookies % 5 == 0 and pipe_gap > 130:
                pipe_gap -= 5

        # COLLISION
        teddy_rect = pygame.Rect(teddy_x, teddy_y, 40, 40)

        for p in pipes:

            top = pygame.Rect(p["x"], 0, pipe_width, p["height"])
            bottom = pygame.Rect(p["x"], p["height"] + pipe_gap, pipe_width, HEIGHT)

            if teddy_rect.colliderect(top) or teddy_rect.colliderect(bottom):
                state = GAME_OVER

        if teddy_y < 0 or teddy_y > HEIGHT:
            state = GAME_OVER

        # DRAW PIPES
        for p in pipes:
            pygame.draw.rect(screen, GREEN, (p["x"], 0, pipe_width, p["height"]))
            pygame.draw.rect(screen, GREEN, (p["x"], p["height"] + pipe_gap, pipe_width, HEIGHT))

        # 🧸 TEDDY IMAGE
        screen.blit(teddy_img, (teddy_x, teddy_y))

        # 🍪 HUD (TOP LEFT)
        screen.blit(cookie_img, (10, 10))
        hud = font_small.render(str(cookies), True, WHITE)
        screen.blit(hud, (50, 12))

    # 💀 GAME OVER
    elif state == GAME_OVER:

        if cookies > best_cookies:
            best_cookies = cookies

        screen.blit(skull_img, (175, 120))

        title = font_big.render("You Lost!", True, WHITE)
        msg = font_small.render("Teddy crashed into pipes 😭", True, WHITE)
        score = font.render(f"Cookies: {cookies}", True, WHITE)
        best = font.render(f"Best: {best_cookies}", True, WHITE)
        restart = font.render("Press SPACE to Restart", True, WHITE)

        screen.blit(title, (120, 200))
        screen.blit(msg, (70, 260))
        screen.blit(score, (110, 320))
        screen.blit(best, (130, 370))
        screen.blit(restart, (40, 430))

    pygame.display.update()
    clock.tick(60)
