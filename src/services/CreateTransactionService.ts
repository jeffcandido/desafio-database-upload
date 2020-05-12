import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }
    const transactionWithSameCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (transactionWithSameCategory) {
      const transaction = transactionsRepository.create({
        title,
        value,
        type,
        category: transactionWithSameCategory,
      });

      await transactionsRepository.save(transaction);

      return transaction;
    }

    const transactionCategory = await categoriesRepository.create({
      title: category,
    });

    await categoriesRepository.save(transactionCategory);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
