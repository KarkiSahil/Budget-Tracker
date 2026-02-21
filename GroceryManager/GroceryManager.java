import java.util.Scanner;

/**
 * GroceryManager is a grocery management system
 * that provides a user menu to interact with
 * inventory functions.
 */
public class GroceryManager {

    /**
     * The main method runs the grocery management system.
     * It displays a menu and calls the appropriate methods
     * based on user input.
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {

        String[] itemNames = new String[10];
        double[] itemPrices = new double[10];
        int[] itemStocks = new int[10];

        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.println("\n--- Grocery Management System ---");
            System.out.println("1. View Inventory");
            System.out.println("2. Restock Item");
            System.out.println("3. Exit");
            System.out.print("Enter your choice: ");

            String choice = scanner.nextLine();

            if (choice.equals("1")) {

                printInventory(itemNames, itemPrices, itemStocks);

            } else if (choice.equals("2")) {

                System.out.print("Enter item name to restock: ");
                String target = scanner.nextLine();

                System.out.print("Enter amount to add: ");
                int amount = Integer.parseInt(scanner.nextLine());

                restockItem(itemNames, itemStocks, target, amount);

            } else if (choice.equals("3")) {

                System.out.println("Exiting program. Goodbye!");
                break;

            } else {

                System.out.println("Invalid option. Please try again.");
            }
        }

        scanner.close();
    }

    /**
     * Placeholder for Task 1 method.
     * Implemented in feature-display branch.
     */
    public static void printInventory(String[] names, double[] prices, int[] stocks) {
        // Implementation will be added in feature-display branch
    }

    /**
     * Placeholder for Task 2 method.
     * Implemented in feature-restock branch.
     */
    public static void restockItem(String[] names, int[] stocks, String target, int amount) {
        // Implementation will be added in feature-restock branch
    }
}